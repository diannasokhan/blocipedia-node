const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    signUp(req, res, next){    
        res.render("users/sign_up")
    },
    create(req, res, next){
        let newUser = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };
        userQueries.createUser(newUser, (err, user) => {
            if(err){
                req.flash("error", err);
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
                })
            }
        })
    }
}