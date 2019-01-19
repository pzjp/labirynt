/* Obsługa połaczeń serwera z bazą danych, w tym autoryzacja użytkowników. */
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

/* Format danych w bazie */
var userSchema = mongoose.Schema({ // UŻYTKOWNICY
  user: {
    name: { type:String, unique: true },
    password: String,
    levels: [{id: String, leastmoves: Number}]
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
      return;
    }
    console.log("New solution.");
    this.level.solutions= [...this.level.solutions, solution.path];
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
getAllLevels: function(filter, nextOp) {
    mongooseLevel.find(filter, function(err, levels) {
      if(err) nextOp(err,null);
      else {
        const result = levels.map(
          lev =>{ console.log(JSON.stringify(lev.level));
            return { id:lev.level.id,
              answer: lev.level.solutions.find(e=>true) };
          } );
        nextOp(null,result);
      }
    });
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
getPlayerStats(userId,nextOp)
{
  mongooseUser.findById(userId, function(err, user) {
    if(err) nextOp(err,null);
    else if(user) {
      console.log(JSON.stringify(user));
      var result = user.user.levels.map(
        level =>{
          return {id:level.id,
            player: {solved: true, moves: level.leastmoves}};
        });
      nextOp(null,result);
    }
    else nextOp(null,[]);
  });
}
};

// Weryfikuje, czy dane rozwiąznie planszy jest faktycznie jej rozwiązaniem.
function validatePaths(originalPath, newPath)
{
  if (originalPath==newPath) return true;
  if (originalPath.length != newPath.length)
  {
    console.log('Length mismatch!');
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
        console.log('Invalid level definition!');
        return false;
    }
  }
  x = 0; y = 5;
  for (i = 0; i < newPath.length; i++)
  {
    if (values[x]) --(values[x][y]);
    else return false; // niedozwolony ruch
    if (values[x][y]<=0) return false; // niedozwolony ruch!
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

/* Aktualizuje bazę danych porzez dopisanie nowego rozwiązania dla planszy.
Aktualizuje informację o planszy i użytkowniku. Wynik zwraca do fukcji done. */
function validateLevel(levelId, userName, solution, done)
{
  console.log("Validating solution to level '"+levelId+"'")
  const level = mongooseLevel.findOne({'level.id':levelId}, function(err1, level)
  {
    if (err1) { console.log('Error searching level!');
      done(err1); return;  }
    if (level)
    {
      const path = level.level.solutions[1];
      if(validatePaths(path, solution.path))
      {
        console.log('Solution validated.')
        if (level.level.leastmoves> solution.moves)
          level.level.leastmoves=solution.moves;
        level.addSolution(solution, function(){})
        console.log("Searching user: '"+userName.user.name+"'...");
        mongooseUser.findById(userName._id, function(err, user){
          if (err) {
            console.log("Error searching user!");
            level.save(function(errr){if(errr) console.log("Error updating level stats!")});
            done(err); return;  }
          if (user)
          { 
            console.log("User found.");
            var levels = user.user.levels;
            var found =false;
            levels = levels.map(e=> { if (e.id!=levelId) return e;
              found = true;
              if (e.leastmoves>solution.moves)
                return {id: e.id, leastmoves: solution.moves};
              return e;});
            if (!found)
            {
              console.log("First solution from this user.");
              levels= [...levels, {id: levelId, leastmoves: solution.moves} ];
              level.level.players++;
              level.save(function(errr){if(errr) console.log("Error updating level stats!")});
            }
            user.user.levels= levels;
            console.log("Saving user data...");
            user.save(done);
          }
         })
      }
      else
      {
        console.log('Not validated!')
        done(null, false);
      }
    }
    else
    {
      console.log('Level not found!')
      done(null, false);
    }
  });
}