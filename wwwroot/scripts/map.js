var myMap;
var myCollection;

ymaps.ready(init);

function init() {
  document.getElementById('map').style.display = 'block';

  myMap = new ymaps.Map('map', {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
}

function backToMap() {
  if (myMap!=null) myMap.destroy();
  init();
}

function getPort()
{
  if (myMap!=null) myMap.destroy();
  ymaps.ready(portInit());
}

function portInit()
{
  document.getElementById('map').style.display = 'block';

  myMap = new ymaps.Map('map', {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
  myPlaceMark=new ymaps.Placemark(
    [55.773332, 49.091457],
    {
      balloonContentHeader: 'Основной порт города Казань',
      balloonContentBody: `Является портом общего пользования, позволяющим осуществлять: 
      1) операции с тарно-штучными грузами, погрузку и выгрузку которых осуществляет порт; 
      2) операции с навалочными и насыпными грузами, погрузку и выгрузку которых осуществляет порт; 
      3) операции с универсальными контейнерами, погрузку и выгрузку которых осуществляет порт; 
      4) операции, связанные с обслуживанием пассажиров. 
      Порт включен в прямое смешанное сообщение`
    },
    {
      preset:'islands#nightWaterwayIcon'
    });
  myMap.geoObjects.add(myPlaceMark);
}

//Запуск отрисовки карты с аэропортом
function getAirPort()
{
  if (myMap!=null) myMap.destroy();
  ymaps.ready(airPortInit());
}

function airPortInit()
{
  document.getElementById('map').style.display = 'block';

  myMap = new ymaps.Map('map', {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
  myPlaceMark=new ymaps.Placemark(
    [55.608250, 49.298055],
    {
      balloonContentHeader: 'Аэропорт города Казань',
      balloonContentBody: 'Международный аэропорт Казань имени Г.М. Тукая'
    },
    {
      preset:'islands#nightAirportIcon'
    });
  myMap.geoObjects.add(myPlaceMark);
}

//Запуск отрисовки карты с медицинскими учреждениями
function hospitalMap() {
  if (myMap != null) myMap.destroy();
  ymaps.ready(hospitalInit);
}

async function hospitalInit() 
{
  document.getElementById('map').style.display = 'block';

  myMap = new ymaps.Map('map', 
  {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
  clusterer = new ymaps.Clusterer(
  {
    preset: 'islands#invertedNightClusterIcons',
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false
  });
  let res = await getFromServer('hospital')
  geoObjects=[];
  for(var i = 0, len = res.length; i < len; i++) 
  {
    if (res[i].Extra=="")
    {
    geoObjects[i] = new ymaps.Placemark(
      res[i].Coordinates,   
      {
        balloonContentBody: res[i].Name,
        clusterCaption: 'Медецинское учреждение № <strong>' + (i+1) + '</strong>'
      },
      {
        preset: 'islands#nightMedicalIcon'
      });
    }
    else
    {
      geoObjects[i] = new ymaps.Placemark(
        res[i].Coordinates,   
        {
          balloonContentBody: res[i].Name,
          balloonContentFooter: res[i].Extra,
          clusterCaption: 'Медецинское учреждение № <strong>' + (i+1) + '</strong>'
        },
        {
          preset: 'islands#nightMedicalIcon'
        });
    }
  }
  clusterer.options.set(
    {
      gridSize: 80,
      clusterDisableClickZoom: true
    });
  clusterer.add(geoObjects);
  myMap.geoObjects.add(clusterer);
}

//Запуск отрисовки карты с объектами ПОО
function getPOO()
{
  if (myMap != null) myMap.destroy();
  ymaps.ready(pooInit);
}

async function pooInit()
{
  document.getElementById('map').style.display = 'block';

  myMap = new ymaps.Map('map', 
  {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
  clusterer = new ymaps.Clusterer(
  {
    preset: 'islands#invertedNightClusterIcons',
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false
  });
  let res = await getFromServer('poo');
  geoObjects=[];
  for(var i = 0, len = res.length; i < len; i++) 
  {
    if (res[i].Extra=="")
    {
    geoObjects[i] = new ymaps.Placemark(
      res[i].Coordinates,   
      {
        balloonContentBody: res[i].Name,
        clusterCaption: 'Объект № <strong>' + (i+1) + '</strong>'
      },
      {
        preset: 'islands#nightAttentionIcon'
      });
    }
    else
    {
      geoObjects[i] = new ymaps.Placemark(
        res[i].Coordinates,   
        {
          balloonContentBody: res[i].Name,
          balloonContentFooter: res[i].Extra,
          clusterCaption: 'Объект № <strong>' + (i+1) + '</strong>'
        },
        {
          preset: 'islands#nightAttentionIcon'
        });
    }
  }
  clusterer.options.set(
    {
      gridSize: 80,
      clusterDisableClickZoom: true
    });
  clusterer.add(geoObjects);
  myMap.geoObjects.add(clusterer);
}

//Запуск отрисовки карты с объектов КВО
function getKVO()
{
  if (myMap != null) myMap.destroy();
  ymaps.ready(kvoInit);
}

async function kvoInit()
{
  document.getElementById('map').style.display = 'block';
  myMap = new ymaps.Map('map', 
  {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
  clusterer = new ymaps.Clusterer(
  {
    preset: 'islands#invertedNightClusterIcons',
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false
  });
  let res = await getFromServer('kvo');
  geoObjects=[];
  for(var i = 0, len = res.length; i < len; i++) 
  {
    if (res[i].Extra=="")
    {
    geoObjects[i] = new ymaps.Placemark(
      res[i].Coordinates,   
      {
        balloonContentBody: res[i].Name,
        clusterCaption: 'Объект № <strong>' + (i+1) + '</strong>'
      },
      {
        preset: 'islands#nightAttentionIcon'
      });
    }
    else
    {
      geoObjects[i] = new ymaps.Placemark(
        res[i].Coordinates,   
        {
          balloonContentBody: res[i].Name,
          balloonContentFooter: res[i].Extra,
          clusterCaption: 'Объект № <strong>' + (i+1) + '</strong>'
        },
        {
          preset: 'islands#nightAttentionIcon'
        });
    }
    
  }
  clusterer.options.set(
    {
      gridSize: 80,
      clusterDisableClickZoom: true
    });
  clusterer.add(geoObjects);
  myMap.geoObjects.add(clusterer);

}

//Запуск отрисовки карты с автомобильными мостами
function getBridges()
{
  if (myMap != null) myMap.destroy();
  ymaps.ready(bridgesInit);
}

async function bridgesInit()
{
  document.getElementById('map').style.display = 'block';

  myMap = new ymaps.Map('map', 
  {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
  clusterer = new ymaps.Clusterer(
  {
    preset: 'islands#invertedNightClusterIcons',
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false
  });
  let res = await getFromServer('bridg');
  geoObjects=[];
  for(var i = 0, len = res.length; i < len; i++) 
  {
    if (res[i].Extra=="")
    {
    geoObjects[i] = new ymaps.Placemark(
      res[i].Coordinates,   
      {
        balloonContentBody: res[i].Name,
        clusterCaption: 'Мост № <strong>' + (i+1) + '</strong>'
      },
      {
        preset: 'islands#nightAutoIcon'
      });
    }
    else
    {
      geoObjects[i] = new ymaps.Placemark(
        res[i].Coordinates,   
        {
          balloonContentBody: res[i].Name,
          balloonContentFooter: res[i].Extra,
          clusterCaption: 'Мост № <strong>' + (i+1) + '</strong>'
        },
        {
          preset: 'islands#nightAutoIcon'
        });
    }
  }
  clusterer.options.set(
    {
      gridSize: 80,
      clusterDisableClickZoom: true
    });
  clusterer.add(geoObjects);
  myMap.geoObjects.add(clusterer);

}

//Запуск отрисовки карты с инфекционными стационарами
function getInfec() {
  if (myMap != null) myMap.destroy();
  ymaps.ready(infecInit);
}

async function infecInit() 
{
  document.getElementById('map').style.display = 'block';

  myMap = new ymaps.Map('map', 
  {
    center: [55.796127, 49.106414], // Казань
    zoom: 10
  },
  {
    searchControlProvider: 'yandex#search'
  });
  clusterer = new ymaps.Clusterer(
  {
    preset: 'islands#invertedNightClusterIcons',
    groupByCoordinates: false,
    clusterDisableClickZoom: true,
    clusterHideIconOnBalloonOpen: false,
    geoObjectHideIconOnBalloonOpen: false
  });
    let res = await getFromServer('infec');
    if (res != -1) {
        geoObjects = [];
        for (var i = 0, len = res.length; i < len; i++) {
            if (res[i].Extra == "") {
                geoObjects[i] = new ymaps.Placemark(
                    res[i].Coordinates,
                    {
                        balloonContentBody: res[i].Name,
                        clusterCaption: 'Медецинское учреждение № <strong>' + (i + 1) + '</strong>'
                    },
                    {
                        preset: 'islands#nightMedicalIcon'
                    });
            }
            else {
                geoObjects[i] = new ymaps.Placemark(
                    res[i].Coordinates,
                    {
                        balloonContentBody: res[i].Name,
                        balloonContentFooter: res[i].Extra,
                        clusterCaption: 'Медецинское учреждение № <strong>' + (i + 1) + '</strong>'
                    },
                    {
                        preset: 'islands#nightMedicalIcon'
                    });
            }
        }
        clusterer.options.set(
            {
                gridSize: 80,
                clusterDisableClickZoom: true
            });
        clusterer.add(geoObjects);
        myMap.geoObjects.add(clusterer);
    }
    else
        alert("Не удалось загрузить объекты");
  
}

//Запрос к серверу за получением списка координат
async function getFromServer(name)
{
    let response = await fetch(`https://localhost:5001/${name}/`,
        {
            method: 'GET',
            headers:
            {
                'Content-Type': 'application/json; charset=utf-8'
            }
        }).catch(err => alert("Кажется что-то пошло не так"));

    if (response.ok) {
        let res = await response.json();
        return res;
    }
    else
    {
        let response = await fetch(`https://localhost:25001/${name}/`,
            {
                method: 'GET',
                headers:
                {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).catch(err => alert("Кажется что-то пошло не так"));

        if (response.ok) {
            let res = await response.json();
            return res;
        }
        else
        {
            return -1;
        }

    }

}
