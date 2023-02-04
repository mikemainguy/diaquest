require('graphql-request');
const {GraphQLClient, gql} = require('graphql-request');
const {default: axios} = require("axios");
document.addEventListener('gqlquery', async (event) => {
    const profile = await getProfile();
    const q = gql`
 {
  actor {
    account(id: ${profile.newrelic_account}) {
      id
      name
      nrql(query: 
      "${event.detail.query}"
      ) {
        results
      }
    }
  }
}
`;

    const client = new GraphQLClient('/graphql', {});

    client.setHeader('Api-Key', profile.newrelic_token);

    const results = await client.request(q);
    const data = results.actor.account.nrql.results;


    const overall = {
        series: {},
        maxValue: 0
    }
    for (const d of data) {
        const point = {time: d['beginTimeSeconds']};
        point.data = [];
        for (const l of event.detail.labels) {

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

    const scene = document.querySelector('a-scene');
    const item = document.createElement('a-entity');

    item.setAttribute('chart', 'chartData: ' + JSON.stringify(overall));
    item.setAttribute('scale', '1 .5 1');
    scene.appendChild(item);


});

async function getProfile() {
    try {
        const profile = await axios.get('/api/user/profile');
        return profile.data;
    } catch (err) {
        console.log(err);
        return null;
    }

}
