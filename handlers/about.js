function about(request, reply) {
  reply.view('about', {
    title: 'About',
  });
}

module.exports = about;
