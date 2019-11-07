const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes: wikis", () => {
    beforeEach((done) => {
        this.wiki;
        this.user;
        sequelize.sync({force: true}).then((res) => {
  
        User.create({
          email: "example@gmail.com",
          username: "ChubbyBunny",
          password: "hello123",
          role: "standard"
        
        }).then((user) => {
         
          this.user = user;
          request.get({
            url: "http://localhost:3000/auth/fake",
            form: {
              role: user.role,
              id: user.id,
              email: user.email
            },
          });
          Wiki.create({
            title: "Penguins",
            body: "Why are penguins called penguins?",
            private: false,
            userId: user.id
          })
           .then((wiki) => {
             this.wiki = wiki;
             done();
           })
           .catch((err) => {
             console.log(err);
             done();
           });
   
         })
        })
      })
  
        describe("GET /wikis", () => {
            
          it("should return all wikis", (done) => {
     
            request.get(base, (err, res, body) => {
              
              expect(err).toBeNull();
              expect(body).toContain("Wikis");
              expect(body).toContain("Penguins");
              done();
            });
          });
        }); 
        describe("GET /wikis/new", () => {
    
          it("should render a new wikis form", (done) => {
            request.get(`${base}/new`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("New Wiki");
              done();
            });
          });
      
        });
    
        describe("POST /wikis/create", () => {
          
          it("should create a new wiki and redirect", (done) => {
            const options = {
              url: `${base}/create`,
              form: {
                title: "Dogs",
                body: "There are 340 dog breeds",
                private: false,
                userId: this.user.id
              }
            };
      
    
            request.post(options,
  
              (err, res, body) => {
      
                Wiki.findOne({where: {title: "Dogs"}})
                .then((wiki) => {
                  expect(wiki.title).toBe("Dogs");
                  expect(wiki.body).toBe("There are 340 dog breeds");
                  done();
                })
                .catch((err) => {
                  console.log(err);
                  done();
                });
              }
            );
          });
        });
        describe("GET /wikis/:id", () => {
    
          it("should render a view with the selected wiki", (done) => {
            request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Penguins");
              done();
            });
          });
     
        });
        describe("POST /wikis/:id/destroy", () => {
    
          it("should delete the wiki with the associated ID", (done) => {
     
            Wiki.findAll()
            .then((wikis) => {
    
              const wikiCountBeforeDelete = wikis.length;
     
              expect(wikiCountBeforeDelete).toBe(1);
     
              request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
                Wiki.findAll()
                .then((wikis) => {
                  expect(err).toBeNull();
                  expect(wikis.length).toBe(wikiCountBeforeDelete - 1);
                  done();
                })
     
              });
            });
     
          });
     
        });
        describe("GET /wikis/:id/edit", () => {
    
          it("should render a view with an edit wiki form", (done) => {
            request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
              expect(err).toBeNull();
              expect(body).toContain("Edit Wiki");
              expect(body).toContain("Penguins");
              done();
            });
          });
     
        });
        describe("POST /wikis/:id/update", () => {
    
          it("should update the wiki with the given values", (done) => {
             const options = {
                url: `${base}/${this.wiki.id}/update`,
                form: {
                  title: "All about penguins",
                  body: "Why are penguins called penguins?"
                }
              };
    
              request.post(options,
                (err, res, body) => {
     
                expect(err).toBeNull();
     
                Wiki.findOne({
                  where: { id: this.wiki.id }
                })
                .then((wiki) => {
                  expect(wiki.title).toBe("All about penguins");
                  done();
                });
              });
          });
        });   
})
