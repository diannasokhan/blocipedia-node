const userQueries = require("../db/queries.users.js");
const wikiQueries = require("../db/queries.wikis.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


function buildErrorList(err) {
    return err.errors.map(error => ({
      location: "body",
      param: error.path + ":",
      msg: error.message,
      value: ""
    }));
  }
module.exports = {
    signUp(req, res, next){    
        res.render("users/sign_up")
    },
    upgrade(req, res, next){
        res.render("users/upgrade")
    },
    success(req, res, next){
    userQueries.upgradeUser(req, (err, user) => {
        if(err){
            req.flash("error", err);
            res.redirect("/users/upgrade");
        }else{
            req.flash("notice", "You've successfully upgraded your account");
            res.redirect("/");
        }
    })
    
    },

    downgrade(req, res, next){
        res.render("users/downgrade")
    },
    downgraded(req, res, next){
        wikiQueries.privateToPublic(req.user.id);
        userQueries.downgradeUser(req, (err, user) => {
            if(err){
                req.flash("error", err);
                res.redirect("/users/downgrade");
            }else{
                req.flash("notice", "You've successfully downgraded your account");
                res.redirect("/");
            }
        })
    } ,
    create(req, res, next){
        let newUser = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
    

            if(err){ 
                req.flash("error", buildErrorList(err));
                res.redirect("/users/sign_up");
            }else{
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed up!");
                    res.redirect("/");

                    const msg = {
                        to: newUser.email,
                        from: 'donotreply@example.com',
                        subject: 'Account Confirmation',
                        text: 'Welcome to Blocipedia!',
                        html: '<strong>Welcome!</strong>',
                      };
                      sgMail.send(msg);
                });
            }
        });
    },
    signInForm(req, res, next){
        res.render("users/sign_in");
    },
    signIn(req, res, next){
        passport.authenticate("local")(req, res, () => {
          if(!req.user){
            req.flash("notice", "Sign in failed. Please try again.")
            res.redirect("/users/sign_in");
          } else {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          }
        })
      },
    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    },
    showCollaborations(req, res, next){
        userQueries.getUser(req.user.id, (err, result) => {
          user = result["user"];
          collaborator = result["collaborator"];
          if(err || user == null){
            res.redirect(404, "/");
          } else {
            res.render("users/collaborations", {user, collaborator});
          }
        });
      }

}