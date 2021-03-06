const trials = require('../../agents/trials');

describe('Trials', () => {
  describe('#get', () => {
    it('returns the trial', () => {
      const data = {
        id: 1,
        title: 'foo',
      };
      apiServer.get('/trials/1').reply(200, data);

      return trials.get(1).should.be.fulfilledWith(data);
    });

    it('rejects if trialId is inexistent', () => {
      apiServer.get('/trials/1').reply(404);

      return trials.get(1).should.be.rejectedWith({
        errObj: { status: 404 },
      });
    });
  });

  describe('#search', () => {
    const response = {
      total_count: 2,
      items: [
        fixtures.getTrial(),
        fixtures.getTrial(),
      ]
    };
    const expectedResponse = JSON.parse(JSON.stringify(response));

    it('returns the response from the search API', () => {
      apiServer.get('/search').reply(200, response);

      return trials.search().should.be.fulfilledWith(expectedResponse);
    });

    it('encodes the query string', () => {
      apiServer.get('/search').query({q: 'foo bar'}).reply(200, response);

      return trials.search('foo bar').should.be.fulfilledWith(expectedResponse);
    });

    it('passes the page number to the query', () => {
      apiServer.get('/search').query({page: 2}).reply(200, response);

      return trials.search(undefined, 2).should.be.fulfilledWith(expectedResponse);
    });

    it('passes the number of items per page to the query', () => {
      apiServer.get('/search').query({per_page: 12}).reply(200, response);

      return trials.search(undefined, undefined, 12).should.be.fulfilledWith(expectedResponse);
    });

    it('adds the filters to the query string', () => {
      apiServer.get('/search').query({q: '(foo bar) AND location:"Czech Republic"'}).reply(200, response);

      return trials.search('foo bar', undefined, undefined, { location: '"Czech Republic"' })
        .should.be.fulfilledWith(expectedResponse);
    });

    it('rejects the promise if there was some problem with the API call', () => {
      apiServer.get('/search').reply(500);

      return trials.search().should.be.rejected();
    });
  });
});
