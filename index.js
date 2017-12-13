const csv = require('csv-streamify');
const fs = require('fs');
const elasticsearch = require('elasticsearch');
const esClient = new elasticsearch.Client({
  host: '192.168.56.103:9200',
  log: 'trace'
});

const parser = csv({ objectMode: true, columns: true, newline: '\r\n' }, function (err, result) {
  if (err) throw err;
  // our csv has been parsed succesfully
  result.forEach(function (line) {
    esClient.index({
      index: 'gb_products',
      type: 'product',
      body: line
    }, function (error, response) {
      if (error) throw error;

      console.log(response);
    });
  });
});

// now pipe some data into it
fs.createReadStream('/Users/ageorgin/Downloads/gb_product_list.csv').pipe(parser);
