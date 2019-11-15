exports.getOverview = (request, response) => {
  response.status(200).render('overview', {
    title: 'Exciting tours for adventurous people'
  });
};

exports.getTour = (request, response) => {
  response.status(200).render('tour', {
    title: 'The Forest Hiker'
  });
};
