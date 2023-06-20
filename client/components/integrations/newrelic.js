require('graphql-request');
const {GraphQLClient, gql} = require('graphql-request');
const {default: axios} = require("axios");
AFRAME.registerComponent('newrelic', {
    init: async function() {
            const q = gql`
 {
  actor {
    account(id: 622279) {
      id
      name
      nrql(query: 
      "SELECT count(*) as value2, percentile(largestContentfulPaint, 95) as value1 FROM PageViewTiming  SINCE 3 days AGO facet pageUrl order by value2 desc limit 20 timeseries 1 hour"
      ) {
        results
      }
    }
  }
}`;
            const labels = [
                {field: 'value1',
                    label: 'Response Time',
                    scale: .1,
                    mapping: function(d) {return d['value1']['95']}},
                {field: 'value2', label: 'Count', scale: .1}
            ];

            const client = new GraphQLClient('/api/newrelic/graphql', {});

            const results = await client.request(q);
            const data = results.actor.account.nrql.results;
            const overall = {
                series: {},
                maxValue: 0
            }
            for (const d of data) {
                const point = {time: d['beginTimeSeconds']};
                point.data = [];

                for (const l of labels) {

                    if (l.mapping) {
                        point.data.push({value : l.mapping(d), label: l.label, scale: l.scale});
                    } else {
                        point.data.push({value : d[l.field], label: l.label, scale: l.scale});
                    }

                }


                if (overall.series[d['facet']]) {
                    overall.series[d['facet']].points.push(point);
                } else {
                    overall.series[d['facet']] = {label: d['facet'], points: [point]};
                }
            }
            const item = this.el;
            item.setAttribute('chart', 'chartData: ' + JSON.stringify(overall));
            item.setAttribute('scale', '1 .5 1');

    }
});