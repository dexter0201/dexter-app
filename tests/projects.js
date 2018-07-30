const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

let should = chai.should();
let token;
let projectId;

describe('Project Management', () => {
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
  describe('/Post request for project creation', () => {
    it('it should create a project', (done) => {
      const body = {
        name: 'Project1',
        description: 'This is the test project.'
      };
      chai.request('localhost:3000')
        .post('/projects/create')
        .set('auth-token', token)
        .send(body)
        .end((err, res) => {
          projectId = res.body.projectId;
          res.should.have.status(200);
          res.body.should.be.a('object');
        done();
      });
    });
  });
  describe('/Get request for projects', () => {
    it('it should get projects', (done) => {
      const body = {
        name: 'Project1',
        description: 'This is the test project.'
      };
      chai.request('localhost:3000')
        .get('/projects/list')
        .set('auth-token', token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
        done();
      });
    });
  });
  // this can be tested after the above test run
  // describe('/Put request for project update', () => {
  //   it('it should update a project', (done) => {
  //     const body = {
  //       name: 'Project2',
  //       description: 'This is the test project.'
  //     };
  //     chai.request('localhost:3000')
  //       .put(`/projects/${projectId}/update`)
  //       .set('auth-token', token)
  //       .send(body)
  //       .end((err, res) => {
  //         res.should.have.status(200);
  //         res.body.should.be.a('object');
  //       done();
  //     });
  //   });
  // });
});
