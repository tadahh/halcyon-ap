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

var artifactWeapons = {
  'Maw of the Damned': 'Blood',
  'Blades of the Fallen Prince': 'Frost',
  'Apocalypse': 'Unholy',
  'Twinblades of the Deceiver': 'Havoc',
  'Aldrachi Warblades': 'Vengeance',
  'Scythe of Elune': 'Balance',
  'Fangs of Ashamane': 'Feral',
  'Claws of Ursoc': 'Guardian',
  'G\'Hanir, the Mother Tree': 'Restoration',
  'Titanstrike': 'Beast Mastery',
  'Thas\'dorah, Legacy of the Windrunners': 'Marksmanship',
  'Talonclaw': 'Survival',
  'Aluneth': 'Arcane',
  'Felo\'melorn': 'Fire',
  'Ebonchill': 'Frost',
  'Fu Zan, the Wanderer\'s Companion': 'Brewmaster',
  'Sheilun, Staff of the Mists': 'Mistweaver',
  'Fists of the Heavens': 'Windwalker',
  'The Silver Hand': 'Holy',
  'Truthguard': 'Protection',
  'Ashbringer': 'Ret',
  'Light\'s Wrath': 'Discipline',
  'T\'uure, Beacon of the Naaru': 'Holy',
  'Xal\'atath, Blade of the Black Empire': 'Shadow',
  'The Kingslayers': 'Assassination',
  'The Dreadblades': 'Outlaw',
  'Fangs of the Devourer': 'Sub',
  'The Fist of Ra-den': 'Ele',
  'Doomhammer': 'Enhance',
  'Sharas\'dal, Scepter of Tides': 'Resto',
  'Ulthalesh, the Deadwind Harvester': 'Affliction',
  'Skull of the Man\'ari': 'Demonology',
  'Scepter of Sargeras': 'Destro',
  'Strom\'kar, the Warbreaker': 'Arms',
  'Warswords of the Valarjar': 'Fury',
  'Scale of the Earth-Warder': 'Prot',
}

getRaiderArtifactLevels(raiderNames, artifactWeapons);

function getRaiderArtifactLevels(raiderNames, artifactWeapons) {
  var raiderArtifactLevels = {};
  var raiderSpecs = {};
  var counter = raiderNames.length;

  for(let i = 0; i < raiderNames.length; i++){
    fetch('https://us.api.battle.net/wow/character/zuljin/'+ raiderNames[i] +'?fields=items&locale=en_US&apikey=nhmm4q7zkyjqxfr3kmbf3crxckdkyk8c')
      .then(function(response) {
        return response.json();
      })
      .then(function(json) {
        let artifactLevel = 0;
        let artifactName = '';

        if(json.items.mainHand.artifactTraits.length == 0){
          artifactLevel = '< 35';
          artifactName = 'Noob';
        } else{

          if(raiderNames[i] == 'Cretox') {
            artifactLevel = json.items.offHand.artifactTraits[json.items.offHand.artifactTraits.length-1].rank + 34;
            artifactName = json.items.offHand.name;
          } else {
            artifactLevel = json.items.mainHand.artifactTraits[json.items.mainHand.artifactTraits.length-1].rank + 34;
            artifactName = json.items.mainHand.name;
          }

        }

        for(var name in artifactWeapons){
          if(artifactName === name){
            artifactName = artifactWeapons[artifactName];
            break;
          }
        }

        raiderArtifactLevels[raiderNames[i]] = artifactLevel;
        raiderSpecs[raiderNames[i]] = artifactName;
        counter--;

        if(counter == 0){
          let averageArtifactLevel = calculateRaidersAverageArtifactLevel(raiderArtifactLevels);
          raiderArtifactLevels["Average Artifact Level"] = averageArtifactLevel;
          createHTMLCards(raiderArtifactLevels, raiderSpecs);
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
  var correctSpecRaiders = Object.keys(raiders).length;

  for (var key in raiders) {
    if(raiders[key] == '< 35'){
      average += 0;
      correctSpecRaiders--;
    } else{
      average += raiders[key];
    }
  }

  average = (average/correctSpecRaiders).toFixed(2);

  return average;
}

function createHTMLCards(raiders, raiderSpec){
  console.log(raiders);
  console.log(raiderSpec);
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
      let p3 = document.createElement('p');
      let raider = document.createTextNode(raiderNames[i][j]);
      let artifactLevel = document.createTextNode(raiders[raiderNames[i][j]]);
      let specName = document.createTextNode(raiderSpec[raiderNames[i][j]]);

      tile.classList.add('tile', 'is-parent');
      article.classList.add('tile', 'is-child', 'box');
      p1.classList.add('title');
      p2.classList.add('subtitle', raiderSpec[raiderNames[i][j]]);
      p3.classList.add('subtitle');

      newRow.appendChild(tile);
      tile.appendChild(article);
      article.appendChild(p1);
      article.appendChild(p2);
      article.appendChild(p3);
      p1.appendChild(raider);
      p2.appendChild(specName);
      p3.appendChild(artifactLevel);
    }

    let loader = document.getElementById('loader');
    loader.classList.add('is-hidden');
    container.classList.remove('is-hidden');
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
