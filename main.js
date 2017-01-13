var raiderNames = [
  'Cretox',
  'Sineris',
  'Juhgz',
  'Laneyqt',
  'Kiiren',
  'Strazi',
  'Hexiled',
  'Abisynth',
  'Hope',
  'Shredi',
  'Heathmagus',
  'Lyncs',
  'Arog',
  'Divinebeaver',
  'Senror',
  'Yertle',
  'Mokini',
  'Papastab',
  'Crckrjack',
  'Manotar',
  'Neakoh',
  'Vaerryx',
  'Lynnette',
  'Delinkwínt',
]

getRaiderArtifactLevels(raiderNames);

function getRaiderArtifactLevels(raiderNames) {
  var raiderArtifactLevels = {};
  var counter = raiderNames.length;

  for(let i = 0; i < raiderNames.length; i++){
    fetch('https://us.api.battle.net/wow/character/zuljin/'+ raiderNames[i] +'?fields=items&locale=en_US&apikey=nhmm4q7zkyjqxfr3kmbf3crxckdkyk8c')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        let artifactLevel = 0;

        if(raiderNames[i] == 'Cretox') {
          artifactLevel = json.items.offHand.artifactTraits[json.items.offHand.artifactTraits.length-1].rank + 34;
        } else {
          artifactLevel = json.items.mainHand.artifactTraits[json.items.mainHand.artifactTraits.length-1].rank + 34;
        }

        raiderArtifactLevels[raiderNames[i]] = artifactLevel;
        counter--;

        if(counter == 0){
          let averageArtifactLevel = calculateRaidersAverageArtifactLevel(raiderArtifactLevels);
          raiderArtifactLevels["Average Artifact Level"] = averageArtifactLevel;
          createHTMLCards(raiderArtifactLevels);
          return raiderArtifactLevels;
        }
      })
      .catch(function(error) {
        console.log('Failed to Acquire Artifact Level for '+ raiderNames[i], error)
      });
  }
}

function calculateRaidersAverageArtifactLevel(raiders){
  var average = 0;

  for (var key in raiders) {
    average += raiders[key];
  }

  average = (average/Object.keys(raiders).length).toFixed(2);

  return average;
}

function createHTMLCards(raiders){
  var raiderNames = Object.keys(raiders).sort();

  let index = raiderNames.indexOf('Average Artifact Level');
  if (index >= 0) {
    raiderNames.splice( index, 1 );
  }

  raiderNames = listToMatrix(raiderNames, 4);

  let averageNumberId = document.getElementById('averageNumber');
  let averageNumber = document.createTextNode(raiders['Average Artifact Level']);
  averageNumberId.appendChild(averageNumber);

  for(let i = 0; i < raiderNames.length; i++){
    let container = document.getElementById("container");
    var newRow = document.createElement('div');

    newRow.id = 'row'+ i;
    newRow.classList.add('tile', 'is-ancestor','has-text-centered');
    container.appendChild(newRow);

    for(let j = 0; j < 4; j++){
      if(raiderNames[i][j] === undefined){
        continue;
      }

      let tile = document.createElement('div');
      let article = document.createElement('article');
      let p1 = document.createElement('p');
      let p2 = document.createElement('p');
      let raider = document.createTextNode(raiderNames[i][j]);
      let artifactLevel = document.createTextNode(raiders[raiderNames[i][j]]);

      tile.classList.add('tile', 'is-parent');
      article.classList.add('tile', 'is-child', 'box');
      p1.classList.add('title');
      p2.classList.add('subtitle');

      newRow.appendChild(tile);
      tile.appendChild(article);
      article.appendChild(p1);
      article.appendChild(p2);
      p1.appendChild(raider);
      p2.appendChild(artifactLevel);
    }
  }
}

function listToMatrix(list, elementsPerSubArray) {
    var matrix = [], i, k;

    for (i = 0, k = -1; i < list.length; i++) {
        if (i % elementsPerSubArray === 0) {
            k++;
            matrix[k] = [];
        }

        matrix[k].push(list[i]);
    }

    return matrix;
}
