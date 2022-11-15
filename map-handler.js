import points from './points.js?4565';

document.addEventListener('DOMContentLoaded', () => {
  const { ymaps } = window;
  ymaps.ready(init);

  function init() {
    const nodeMap = document.querySelector('[data-map]');
    console.log(nodeMap);
    var myMap = new ymaps.Map(nodeMap, {
      center: [56.83580743, 60.61689559],
      zoom: 10,
    });

    const homePoints = points.filter((point) => point.type === 'home');
    const homeCluster = getCluster(homePoints, 'home');
    myMap.geoObjects.add(homeCluster);

    const mountainPoints = points.filter((point) => point.type === 'mountain');
    const mountainCluster = getCluster(mountainPoints, 'mountain');
    myMap.geoObjects.add(mountainCluster);
  }


  /**
   *
   * @param point []
   * @param type 'home' | 'mountain'
   * @return ymaps.Clusterer
   */
  function getCluster(point, type) {
    const cluster = new ymaps.Clusterer({
      clusterIconLayout: 'default#pieChart'
    })

    let preset = 'islands#blueDotIcon';
    if (type === 'home') {
      preset = 'islands#redHomeIcon';
    } else if (type === 'mountain') {
      preset = 'islands#darkOrangeMountainIcon';
    }

    return point.reduce((clusterer, point) => {
      let balloonContent = '';
      if (point.address) {
        balloonContent += `<h3>${point.address}</h3>`
      }
      if (point.link) {
        balloonContent += `<a href="${point.link}">${point.link}</a>`
      }
      if (point.price) {
        balloonContent += `<p>Цена: ${point.price.toLocaleString()}</p>`;
      }
      if (point.options) {
        balloonContent += '<ul>'
        Object.entries(point.options).forEach(([key, value]) => {
          balloonContent += `<li><b>${key}:</b> ${value}</li>`
        });
        balloonContent += '</ul>';
      }
      if (point.imags) {
        balloonContent += '<div class="map-imag-slider">'
        point.imags.forEach((value) => {
          balloonContent += `<img src="${value}" alt="" class="map-imag-slider__item">`
        });
        balloonContent += '</div>';
      }


      const placemark = new ymaps.Placemark(point.cord, {
        hintContent: 'hintContent',
        balloonContent: balloonContent,
      }, {
        preset,
      });

      clusterer.add(placemark);

      return clusterer;
    }, cluster);
  }
});
