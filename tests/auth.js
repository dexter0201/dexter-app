const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let should = chai.should();
let token;

describe('Authentication', () => {
  // should run only once to add new users
  // describe('/Post request for user signup', () => {
  //   it('it should make a new user', (done) => {
  //     const credential = {
  //       username: 'tester12',
  //       password: 'test@12'
  //     };
  //     chai.request('localhost:3000')
  //       .post('/auth/signup')
  //       .send(credential)
  //       .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.be.a('object');
  //         done();
  //       });
  //   });
  // });
  describe('/Post request for user login', () => {
    it('it should login the user', (done) => {
      const credential = {
        username: 'tester12',
        password: 'test@12'
      };
      chai.request('localhost:3000')
        .post('/auth/login')
        .send(credential)
        .end((err, res) => {
            token = res.body.token;
            res.should.have.status(200);
            res.body.should.be.a('object');
          done();
        });
    });
  });
  // describe('/Get request for user logout', () => {
  //   it('it should logout the user', (done) => {
  //     chai.request('localhost:3000')
  //       .get('/auth/logout')
  //       .set('auth-token', token)
  //       .end((err, res) => {
  //           res.should.have.status(200);
  //           res.body.should.be.a('object');
  //         done();
  //       });
  //   });
  // });
})
