/* Obsługa połaczeń serwera z bazą danych, w tym autoryzacja użytkowników. */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

/* Format danych w bazie */
var userSchema = mongoose.Schema({ // UŻYTKOWNICY
  user: {
    name: { type:String, unique: true },
    password: String,
    levels: [{id: String, leastmoves: Number}],
    special: String
  }
});

var levelSchema = mongoose.Schema({ // PLANSZE
    level: {
      id: { type:String, unique: true },
      leastmoves: Number,
      players: Number,
      solutions: [String]
    }
  });

/* Dopisuje nowe rozwiązanie, ale NIE AKTUALIZYJE BAZY.
Aktualizacja wymaga osobnego wywołania metody save() */
levelSchema.methods.addSolution = function(solution){
    if (this.level.leastmoves<0 || solution.moves< this.level.leastmoves)
        this.level.leastmoves=solution.moves;
    if ( this.level.solutions.find( (sol) => sol===solution.path ) )
    {
      console.log("Solution known.");
      return false;
    }
    console.log("New solution.");
    this.level.solutions= [...this.level.solutions, solution.path];
    return true;
};

levelSchema.methods.anyPath = function(){
  return this.level.solutions.find( sol => true );
};

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.user.password);
};

/* Zarejestruj schematy w bazie danych. */
var mongooseUser = mongoose.model('User', userSchema);
var mongooseLevel = mongoose.model('Level', levelSchema);

var LocalStrategy = require('passport-local').Strategy;

module.exports = {
    user: mongooseUser,
    level: mongooseLevel,
    config: function(passport) {

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
      mongooseUser.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use('local-signup', new LocalStrategy({ // Rejestrcja nowego użytkownika
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true,
        },
  function(req, username, password, done) {
    process.nextTick(function() {
      console.log("Adding user ("+username+")")
      mongooseUser.findOne({ 'user.name':  username }, function(err, user) {
        if (err) return done(err);
        if (user)
        {
          return done(null, false, req.flash('signupMessage', "Podana nazwa użytkownika jest już zajęta."));
        }
        else
        {
          var newUser = new mongooseUser();
          newUser.user.name= username;
          newUser.user.password = newUser.generateHash(password);
          newUser.user.levels = [];
          newUser.user.special = "";
          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  passport.use('local-login', new LocalStrategy({
          usernameField: 'username',
          passwordField: 'password',
          passReqToCallback: true,
        },
  function(req, username, password, done) {
    console.log("Signing In...")
    mongooseUser.findOne({ 'user.name':  username }, function(err, user) {
      if (err)
      {
        console.log(">> Database error.");
        return done(err, false, req.statusCode(500));
      }
      if (!user)
      {
        console.log(">> User not found.");
        return done(null, false, req.flash('loginMessage', 'Nie ma takiego użytkownika.'));
      }
      if (!user.validPassword(password))
      {
        console.log(">> Bad password.");
        return done(null, false, req.flash('loginMessage', 'Nieprawidłowe hasło.'));
      }
      console.log(">> OK.");
      return done(null, user);
    });
  }));
},
validateSolution: validateLevel,
getAllLevels: function(filter, nextOp) { // Pobierz listę plansz z bazy (przy podanym filtrze)
    mongooseLevel.find(filter).sort('level.id').exec(function(err, levels) {
      if(err) nextOp(err,null);
      else {
        const result = levels.map(
          lev =>{ //console.log(JSON.stringify(lev.level));
            return { id:lev.level.id,
              answer: lev.anyPath() };
          } );
        nextOp(null,result);
      }
    });
  },
getUserLevels: function(userId, nextOp) { // Pobierz listę plansz ukończonych przez danego gracza
    mongooseUser.findById(userId, function(err,userObj){
      if(err) nextOp(err,null);
      else
        mongooseLevel.find({}, function(err, levels) {
          if(err) nextOp(err,null);
          else {
            const result = levels.map(
              lev =>{ //console.log(JSON.stringify(lev.level));
                return { id:lev.level.id,                     // identyfikator/numer/nazwa
                  answer: lev.anyPath(),  // Dowolne rozwiązanie = opis planszy
                  solved: !!userObj.user.levels.find(e => e.id==lev.level.id) // Czy użytkownik rozwiązał? 
                };
              } );
            nextOp(null,result);
          }
        }); });
  },
getLevelStats: function( nextOp ) {
  mongooseLevel.find({}, function(err, levels) {
    if(err) nextOp(err,null);
    else {
      const result = levels.map(
          lev =>{ let out= {id: lev.level.id,
              solutions: lev.level.solutions.length,
              players:   lev.level.players,
              moves:     lev.level.leastmoves,
              player:    {solved: false} };
            if (out.moves<=0 || out.players<=0)
            {
              out.moves=undefined;
              out.players=0;
            };
            return out;
          } );
      nextOp(null,result);
    }
  });
},
getPlayerStats(userId,nextOp) // Pobiera informację o planszach ukończonych przez danego gracza
{
  mongooseUser.findById(userId, function(err, user) {
    if(err) nextOp(err,null);
    else if(user) {
      //console.log(JSON.stringify(user));
      var result = user.user.levels.map(
        level =>{
          return {id:level.id,
            player: {solved: true, moves: level.leastmoves}};
        });
      nextOp(null,result);
    }
    else nextOp(null,[]);
  });
},
listAllUsers(nextOp){
  mongooseUser.find({}, function(err, users) {
    if(err) nextOp(err,null);
    else 
      nextOp(null,
        users.map(auser => {
            return {name: auser.user.name,
              results: auser.user.levels.map( entry =>{
                return {id: entry.id, moves: entry.leastmoves};
              })};})
      );
  });
},
upsertLevel(levelId, path, nextOp){ // Dodawanie (nadpisywanie) planszy
  if(!checkLevelFits(path,20,11))      // Czy kod planszy jest poprawny?
    nextOp('Level does not fit!',false);
  else
  mongooseLevel.findOne({"level.id":levelId},function(err,level){
    if(err) nextOp(err,false);
    else if(level) // Identyfikator planszy jest już zajęty
    {
      if(validatePaths(level.anyPath(), path))
        nextOp(null,"Plansza jest identyczna z istniejącą."); // Identyczna plansza już istnieje!
      else {
        process.nextTick(function(){
          level.level.solutions=[path];
          level.level.players=0;
          level.level.leastmoves=path.length;
          level.save(nextOp); });
      }
    }else{  // Planszy o takim id nie było dotąd w bazie.
      process.nextTick(function(){
        var level = new mongooseLevel();
        level.level.id=levelId;
        level.level.solutions=[path];
        level.level.players=0;
        level.level.leastmoves=path.length;
        level.save(nextOp); // Dodaj planszę do bazy
      });
    }
  });
}
};

// Weryfikuje, czy dane rozwiąznie planszy jest faktycznie jej rozwiązaniem.
function validatePaths(originalPath, newPath)
{
  if (originalPath==newPath) return true;
  if (originalPath.length != newPath.length)
  {
    console.log(' Length mismatch!');
    return false;
  }
  var x, y, i;
  var values = [];
  x = 0; y = 5;
  for (i = 0; i < originalPath.length; i++)
  {
    if ( values[x] ) ++(values[x][y]);
    else
    {
      values[x]=[]; // Utwórz nową kolumnę
      values[x][y]=1;
    }
    switch (originalPath.charAt(i)) {
      case 'g': y--; break;
      case 'd': y++; break;
      case 'l': x--; break;
      case 'p': x++; break;
      default:
        console.log(' Invalid level definition!');
        return false;
    }
  }
  x = 0; y = 5;
  for (i = 0; i < newPath.length; i++)
  {
    if (values[x]) --(values[x][y]);
    else return false; // niedozwolony ruch
    if (values[x][y]<0)
    {
      console.log(" Minus na ("+x+","+y+")");
      return false; // niedozwolony ruch!
    }
    switch (newPath.charAt(i)) {
      case 'g': y--; break;
      case 'd': y++; break;
      case 'l': x--; break;
      case 'p': x++; break;
      default: return false;
    }
  }
  return true;
}

function countMoves(apath)
{
  var moves=0;
  for(var i=1; i<apath.length; i++)
  {
    if (apath.charAt(i-1)!=apath.charAt(i)) moves++;
  }
  return moves;
}

function checkLevelFits(path,width,height)
{
  if(path.length<10) return false; // Nie pozwól dodać zbyt krótkiej planszy!
  let x, y, i;
  x = 0; y = 5;
  for (i = 0; i < path.length; i++)
  {
    switch (path.charAt(i)) {
      case 'g': y--; break;
      case 'd': y++; break;
      case 'l': x--; break;
      case 'p': x++; break;
      default: return false;
    }
    if (y<0 || x<0 || x>=width || y>=height)
    {
      console.log(JSON.stringify({x:x, y:y, index:i}));
      return false;
    }
  }
  return true;
}

/* Aktualizuje bazę danych porzez dopisanie nowego rozwiązania dla planszy.
Aktualizuje informację o planszy i użytkowniku. Wynik zwraca do fukcji done. */
function validateLevel(levelId, userName, solution, done)
{
  console.log("Weryfikacja rozizania planszy '"+levelId+"'");
  if (countMoves(solution.path)>solution.moves)
  {
    console.log(" Zbyt mało ruchów!");
    done("Too small number of moves!");
    return;
  }
  const level = mongooseLevel.findOne({'level.id':levelId}, function(err1, level)
  {
    if (err1) { console.log(' Nie ma takiej planszy!');
      done(err1); return;  }
    if (level)
    {
      const path = level.anyPath();
      if(validatePaths(path, solution.path))
      {
        var answer = {unknown: false, globalbest: false, yourbest: false};
        console.log(' Rozwiązanie poprawne.')
        if (level.level.leastmoves>solution.moves)
        {
          answer.globalbest=true;
          level.level.leastmoves=solution.moves;
        }
        answer.unknown = level.addSolution(solution);
        console.log("  Wyszukiwanie użytkownika: '"+userName.user.name+"'...");
        mongooseUser.findById(userName._id, function(err, user){
          if (err) {
            console.log("  BŁĄD!");
            done(err,false); return;
          }
          if (user)
          { 
            console.log("  OK.");
            var levels = user.user.levels;
            var found =false;
            levels = levels.map(e=> { if (e.id!=levelId) return e;
              found = true;
              if (e.leastmoves>solution.moves)
              {
                solution.yourbest=true;
                return {id: e.id, leastmoves: solution.moves};
              }
              return e;});
            if (!found)
            {
              console.log("  Pierwsze rozwiązanie!");
              levels= [...levels, {id: levelId, leastmoves: solution.moves} ];
              level.level.players++; 
            }
            level.save(function(errr){
                  if(errr) console.log("  Error updating level stats!");
                  else console.log("  Level stats updated!");
                });
            user.user.levels= levels;
            console.log("  Zapis danych użytkownika...");
            user.save(function(errr){
              done(errr, answer);
            });
          }
          else
          {
            console.log("  Brak użytkownika!");
            done('User Not Found',false);
          }
         })
      }
      else
      {
        console.log('Not validated!')
        done('Unauthorized', false);
      }
    }
    else
    {
      console.log('Level not found!')
      done(null, false);
    }
  });
}