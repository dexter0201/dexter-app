const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let should = chai.should();
let token;

describe('User Management', () => {
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
  describe('/Patch request for user change password', () => {
    it('it should change user password', (done) => {
      const body = {
        old_password: 'test@12',
        new_password: 'test@12'
      };
      chai.request('localhost:3000')
        .patch('/users/change-password')
        .set('auth-token', token)
        .send(body)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
          done();
        });
    });
  });
});
