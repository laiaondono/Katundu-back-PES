  describe('signup', () => {
    it('Should add a user into the firestore database', (done) => {
      // A fake request object, with req.query.text set to 'input'
      const req = { query: {un: 'input2',pw:'input2', n:'input2',lat:'1234',lon:'1234'} };
      // A fake response object, with a stubbed redirect function which does some assertions
      const res = {
        send: (code) =>{
            assert.equal(code,"-1");
            console.log("Molt bé maquina");
            done();
        }
        };


      // Invoke addMessage with our fake request and response objects. This will cause the
      // assertions in the response object to be evaluated.
      myFunctions.signup(req, res);
    });
  });
