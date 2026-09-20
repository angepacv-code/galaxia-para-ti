import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/controls/OrbitControls.js';
// ============================================
// 1. ESCENA
// ============================================

const scene = new THREE.Scene();

// ============================================
// DETECTOR DE CLICS
// ============================================

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();

// ============================================
// VIAJE DE LA CÁMARA
// ============================================

let viajando = false;

let objetivoCamara = new THREE.Vector3();
let objetivoMira = new THREE.Vector3();
let recuerdoSeleccionado = null;

// ============================================
// VIAJE ESPACIAL DE INICIO
// ============================================

let viajeIniciado = false;

let viajeFinalizado = false;

let velocidadViaje = 0;


window.addEventListener(
    'click',
    (event) => {

        // Convertimos la posición del mouse
        // a coordenadas que entiende Three.js

        mouse.x =
            (event.clientX / window.innerWidth) * 2 - 1;

        mouse.y =
            -(event.clientY / window.innerHeight) * 2 + 1;

        // Lanzamos el rayo desde la cámara

        raycaster.setFromCamera(
            mouse,
            camera
        );

        // Comprobamos si tocamos estrellas

        const objetosDetectados =
            raycaster.intersectObjects([
                estrellas,
                estrellasGrandes,
                estrellasRecuerdos,
            ]);

            if (objetosDetectados.length > 0) {

                const objeto =
                    objetosDetectados[0].object;
            
                    if (objeto === estrellasRecuerdos) {

                        recuerdoSeleccionado = objeto;
                        // Índice de la estrella que tocamos
                        const indiceRecuerdo =
                        objetosDetectados[0].index;

                        // Buscamos la información correspondiente

                        const recuerdo =

                        recuerdos[indiceRecuerdo];

                        console.log(

                            "💗 Recuerdo:",

                            recuerdo.titulo

                            );

                        console.log(
                            "💗 ¡Encontraste un recuerdo!"
                        );
                    
                        // Obtenemos la posición exacta
                        // de la estrella que tocamos.
                    
                        const posicionEstrella =
                            objeto.geometry.attributes.position;
                    
                        const indice =
                            objetosDetectados[0].index;
                    
                        const posicion =
                            new THREE.Vector3();
                    
                        posicion.fromBufferAttribute(
                            posicionEstrella,
                            indice
                        );
                    
                        // Convertimos la posición
                        // de la galaxia a posición mundial.
                    
                        objeto.localToWorld(posicion);
                    
                        // La cámara se colocará
                        // un poco delante de la estrella.
                    
                        objetivoCamara.copy(posicion);
                    
                        objetivoCamara.multiplyScalar(1.15);
                    
                        objetivoMira.copy(posicion);
                    
                        viajando = true;
                        
                        // Mostramos el recuerdo
                        document.getElementById(
                            'memoryTitle'
                        ).textContent = recuerdo.titulo;
                        
                        document.getElementById(
                            'memoryImage'
                        ).style.backgroundImage =
                            `url("${recuerdo.imagen}")`;
                        
                        document.getElementById(
                            'memoryImage'
                        ).style.backgroundSize =
                            'cover';
                        
                        document.getElementById(
                            'memoryImage'
                        ).style.backgroundPosition =
                            'center';
                        setTimeout(() => {
                            document.getElementById(
                                'memoryPanel'
                                ).style.display = 'flex';
                            }, 1200);
            
                } else {
            
                    console.log(
                        "⭐ Tocaste una estrella"
                    );
                }
            }
    }
);

// ============================================
// 2. CÁMARA
// ============================================

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    2000
);

// La cámara empieza muy lejos de la galaxia.
// Desde aquí comenzará el viaje espacial.

camera.position.set(
    0,
    0,
    700
);

camera.lookAt(0, 0, 0);

// ============================================
// 3. RENDERIZADOR
// ============================================

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';

document
    .getElementById('galaxy')
    .appendChild(renderer.domElement);

// ============================================
// CONTROLES DE LA CÁMARA
// ============================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);


// La cámara se mueve suavemente
controls.enableDamping = true;

// Velocidad de rotación
controls.rotateSpeed = 0.5;

// Velocidad del zoom
controls.zoomSpeed = 0.8;

controls.enablePan = false;
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;

// Evitamos que la cámara se vaya
// demasiado lejos de la galaxia
controls.minDistance = 5;
controls.maxDistance = 1000;


// ============================================
// ESTRELLAS LEJANAS DEL UNIVERSO
// ============================================

const cantidadEstrellasLejanas = 3000;

const posicionesLejanas =
    new Float32Array(cantidadEstrellasLejanas * 3);

for (let i = 0; i < cantidadEstrellasLejanas; i++) {

    const i3 = i * 3;

    // Distribuimos las estrellas alrededor
    // de toda nuestra galaxia.
    const radio = 700;

    const anguloHorizontal =
        Math.random() * Math.PI * 2;

    const anguloVertical =
        Math.acos(
            Math.random() * 2 - 1
        );

    posicionesLejanas[i3] =
        radio *
        Math.sin(anguloVertical) *
        Math.cos(anguloHorizontal);

    posicionesLejanas[i3 + 1] =
        radio *
        Math.cos(anguloVertical);

    posicionesLejanas[i3 + 2] =
        radio *
        Math.sin(anguloVertical) *
        Math.sin(anguloHorizontal);
}

const lejanasGeometry =
    new THREE.BufferGeometry();

lejanasGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        posicionesLejanas,
        3
    )
);

const lejanasMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.8,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

const estrellasLejanas =
    new THREE.Points(
        lejanasGeometry,
        lejanasMaterial
    );

scene.add(estrellasLejanas);

// ============================================
// ESTRELLAS DEL VIAJE ESPACIAL
// ============================================

const estrellasViaje = [];

for (let i = 0; i < 180; i++) {

    const estrella = new THREE.Mesh(
        new THREE.SphereGeometry(0.7, 8, 8),
        new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        })
    );

    // Posición aleatoria alrededor
    estrella.position.set(
        (Math.random() - 0.5) * 500,
        (Math.random() - 0.5) * 300,
        300 - Math.random() * 500
    );

    scene.add(estrella);

    estrellasViaje.push(estrella);
}

// ============================================
// 4. CREAR ESTRELLAS
// ============================================

// Cantidad de estrellas
const cantidadEstrellas = 5000;

const radioZonaCentral = 45;

// Aquí guardaremos las posiciones
// X, Y y Z de cada estrella.
const posiciones = new Float32Array(
    cantidadEstrellas * 3
);


// ============================================
// CREAR GALAXIA ESPIRAL
// ============================================

const brazos = 5;
const radioMaximo = 350;

for (let i = 0; i < cantidadEstrellas; i++) {

    const i3 = i * 3;

    // Distancia de la estrella desde el centro
    let radio =
    radioZonaCentral +
    Math.random() *
    (radioMaximo - radioZonaCentral);

// Dejamos un vacío alrededor del agujero negro
if (radio < radioZonaCentral) {
    radio = radioZonaCentral;
}

    // Elegimos uno de los brazos de la galaxia
    const brazo =
        Math.floor(Math.random() * brazos);

    // Ángulo inicial del brazo
    const anguloBrazo =
        (brazo / brazos) * Math.PI * 2;

    // Cuanto más lejos del centro,
    // más gira la estrella.
    const giro =
    Math.pow(radio / radioMaximo, 1.3) * Math.PI * 1.8;

    // Pequeña variación aleatoria
    // para que no parezca demasiado perfecta.
    const ruido =
        (Math.random() - 0.5) * 1.5;

    const angulo =
        anguloBrazo +
        giro +
        ruido;


    // Posición X
    posiciones[i3] =
        Math.cos(angulo) * radio;


    // Posición Y
    posiciones[i3 + 1] =
    (Math.random() - 0.5) *
    (8 + radio * 0.15);


    // Posición Z
    posiciones[i3 + 2] =
        Math.sin(angulo) * radio;
}

// ============================================
// 5. GEOMETRÍA DE LAS ESTRELLAS
// ============================================

const estrellasGeometry =
    new THREE.BufferGeometry();

estrellasGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        posiciones,
        3
    )
);


// ============================================
// 6. MATERIAL DE LAS ESTRELLAS
// ============================================

// ============================================
// TEXTURA DE ESTRELLA
// ============================================

const canvasEstrella =
    document.createElement('canvas');

canvasEstrella.width = 64;
canvasEstrella.height = 64;

const contextoEstrella =
    canvasEstrella.getContext('2d');

const gradiente =
    contextoEstrella.createRadialGradient(
        32, 32, 0,
        32, 32, 32
    );

gradiente.addColorStop(0, 'rgba(255,255,255,1)');
gradiente.addColorStop(0.15, 'rgba(255,255,255,1)');
gradiente.addColorStop(0.4, 'rgba(255,255,255,0.5)');
gradiente.addColorStop(1, 'rgba(255,255,255,0)');

contextoEstrella.fillStyle = gradiente;

contextoEstrella.fillRect(
    0,
    0,
    64,
    64
);

const texturaEstrella =
    new THREE.CanvasTexture(
        canvasEstrella
    );
// ============================================
// TEXTURA DE ESTRELLA DE 4 PUNTAS
// ============================================

const canvasEstrellaPuntas =
    document.createElement('canvas');

canvasEstrellaPuntas.width = 128;
canvasEstrellaPuntas.height = 128;

const contextoPuntas =
    canvasEstrellaPuntas.getContext('2d');

const centro = 64;

const gradientePuntas =
    contextoPuntas.createRadialGradient(
        centro,
        centro,
        0,
        centro,
        centro,
        64
    );

gradientePuntas.addColorStop(
    0,
    'rgba(255,255,255,1)'
);

gradientePuntas.addColorStop(
    0.08,
    'rgba(255,255,255,1)'
);

gradientePuntas.addColorStop(
    0.25,
    'rgba(255,182,230,0.7)'
);

gradientePuntas.addColorStop(
    0.55,
    'rgba(255,182,230,0.15)'
);

gradientePuntas.addColorStop(
    1,
    'rgba(255,182,230,0)'
);

contextoPuntas.fillStyle =
    gradientePuntas;

contextoPuntas.fillRect(
    0,
    0,
    128,
    128
);


// Cruz vertical
contextoPuntas.globalCompositeOperation =
    'lighter';

contextoPuntas.fillStyle =
    'rgba(255,255,255,0.9)';

contextoPuntas.fillRect(
    62,
    10,
    4,
    108
);

// Cruz horizontal
contextoPuntas.fillRect(
    10,
    62,
    108,
    4
);

const texturaEstrellaPuntas =
    new THREE.CanvasTexture(
        canvasEstrellaPuntas
    );
    const estrellasMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 1.8,
        map: texturaEstrella,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

// ============================================
// 7. CREAR EL CAMPO DE ESTRELLAS
// ============================================

const estrellas =
    new THREE.Points(
        estrellasGeometry,
        estrellasMaterial
    );

scene.add(estrellas);

// ============================================
// ESTRELLAS DESTACADAS
// ============================================

const cantidadGrandes = 120;

const posicionesGrandes =
    new Float32Array(cantidadGrandes * 3);

for (let i = 0; i < cantidadGrandes; i++) {

    const i3 = i * 3;

    const radio =
        Math.random() * radioMaximo;

    const brazo =
        Math.floor(Math.random() * brazos);

    const anguloBrazo =
        (brazo / brazos) * Math.PI * 2;

    const giro =
        Math.pow(radio / radioMaximo, 1.3) *
        Math.PI * 1.8;

    const ruido =
        (Math.random() - 0.5) * 1.5;

    const angulo =
        anguloBrazo +
        giro +
        ruido;

    posicionesGrandes[i3] =
        Math.cos(angulo) * radio;

    posicionesGrandes[i3 + 1] =
        (Math.random() - 0.5) *
        (20 + radio * 0.08);

    posicionesGrandes[i3 + 2] =
        Math.sin(angulo) * radio;
}

const grandesGeometry =
    new THREE.BufferGeometry();

grandesGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        posicionesGrandes,
        3
    )
);

const grandesMaterial =
    new THREE.PointsMaterial({
        color: 0xffffff,
        size: 3.5,
        map: texturaEstrella,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

const estrellasGrandes =
    new THREE.Points(
        grandesGeometry,
        grandesMaterial
    );

scene.add(estrellasGrandes);

// ============================================
// ESTRELLAS DE LOS RECUERDOS
// ============================================

const cantidadRecuerdos = 5;

// ============================================
// INFORMACIÓN DE LOS RECUERDOS
// ============================================

const recuerdos = [

    {
        titulo: "Amor de mi Vida",
        imagen: "assets/images/recuerdo1.jpg"
    },

    {
        titulo: "Para ti",
        imagen: "assets/images/recuerdo2.jpg"
    },

    {
        titulo: "Para Siempre",
        imagen: "assets/images/recuerdo3.jpg"
    },

    {
        titulo: "FELIZ MES MI AMOR",
        imagen: "assets/images/recuerdo4.jpg"
    },

    {
        titulo: "Te amo",
        imagen: "assets/images/recuerdo5.jpg"
    }

];

const posicionesRecuerdos =
    new Float32Array(cantidadRecuerdos * 3);

for (let i = 0; i < cantidadRecuerdos; i++) {

    const i3 = i * 3;

    // Elegimos una posición aleatoria
    // dentro de la galaxia

    const radio =
        40 + Math.random() * 250;

    const brazo =
        Math.floor(
            Math.random() * brazos
        );

    const anguloBrazo =
        (brazo / brazos) *
        Math.PI * 2;

    const giro =
        Math.pow(
            radio / radioMaximo,
            1.3
        ) *
        Math.PI *
        1.8;

    const ruido =
        (Math.random() - 0.5) * 0.5;

    const angulo =
        anguloBrazo +
        giro +
        ruido;

    posicionesRecuerdos[i3] =
        Math.cos(angulo) * radio;

    posicionesRecuerdos[i3 + 1] =
        (Math.random() - 0.5) *
        (10 + radio * 0.1);

    posicionesRecuerdos[i3 + 2] =
        Math.sin(angulo) * radio;
}

const recuerdosGeometry =
    new THREE.BufferGeometry();

recuerdosGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        posicionesRecuerdos,
        3
    )
);

const recuerdosMaterial =
    new THREE.PointsMaterial({
        color: 0xffb6e6,
        size: 5,
        map: texturaEstrellaPuntas,
        transparent: true,
        opacity: 1,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

const estrellasRecuerdos =
    new THREE.Points(
        recuerdosGeometry,
        recuerdosMaterial
    );

scene.add(estrellasRecuerdos);

// ============================================
// DATOS DE LAS ESTRELLAS
// ============================================

estrellasRecuerdos.userData.recuerdos =
    recuerdos;

// ============================================
// POLVO CÓSMICO
// ============================================

const cantidadPolvo = 7000;

const posicionesPolvo =
    new Float32Array(cantidadPolvo * 3);

for (let i = 0; i < cantidadPolvo; i++) {

    const i3 = i * 3;

    // Distribución dentro de la galaxia
    const radio =
        Math.random() * radioMaximo;

    const brazo =
        Math.floor(Math.random() * brazos);

    const anguloBrazo =
        (brazo / brazos) * Math.PI * 2;

    const giro =
        Math.pow(radio / radioMaximo, 1.3) *
        Math.PI * 1.8;

    // Más dispersión que las estrellas
    const ruido =
        (Math.random() - 0.5) * 4;

    const angulo =
        anguloBrazo +
        giro +
        ruido;

    posicionesPolvo[i3] =
        Math.cos(angulo) * radio;

    posicionesPolvo[i3 + 1] =
        (Math.random() - 0.5) *
        (25 + radio * 0.12);

    posicionesPolvo[i3 + 2] =
        Math.sin(angulo) * radio;
}

const polvoGeometry =
    new THREE.BufferGeometry();

polvoGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        posicionesPolvo,
        3
    )
);

const polvoMaterial =
    new THREE.PointsMaterial({
        color: 0x8888aa,
        size: 0.12,
        transparent: true,
        opacity: 0.25,
        sizeAttenuation: true
    });

const polvo =
    new THREE.Points(
        polvoGeometry,
        polvoMaterial
    );

scene.add(polvo);

// ============================================
// NEBULOSAS
// ============================================

const canvasNebulosa =
    document.createElement('canvas');

canvasNebulosa.width = 256;
canvasNebulosa.height = 256;

const contextoNebulosa =
    canvasNebulosa.getContext('2d');

const gradienteNebulosa =
    contextoNebulosa.createRadialGradient(
        128, 128, 0,
        128, 128, 128
    );

gradienteNebulosa.addColorStop(
    0,
    'rgba(255,255,255,0.8)'
);

gradienteNebulosa.addColorStop(
    0.15,
    'rgba(180,120,255,0.5)'
);

gradienteNebulosa.addColorStop(
    0.45,
    'rgba(100,80,255,0.2)'
);

gradienteNebulosa.addColorStop(
    1,
    'rgba(0,0,0,0)'
);

contextoNebulosa.fillStyle =
    gradienteNebulosa;

contextoNebulosa.fillRect(
    0,
    0,
    256,
    256
);

const texturaNebulosa =
    new THREE.CanvasTexture(
        canvasNebulosa
    );


// ============================================
// CREAR NEBULOSAS EN LA GALAXIA
// ============================================

const nebulosas = [];

for (let i = 0; i < 18; i++) {

    const materialNebulosa =
        new THREE.SpriteMaterial({
            map: texturaNebulosa,
            color:
                i % 3 === 0
                    ? 0x8c7cff
                    : i % 3 === 1
                        ? 0xff7fd8
                        : 0x6fa8ff,
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

    const nebulosa =
        new THREE.Sprite(
            materialNebulosa
        );

        const radio =
        60 +
        Math.random() * 280;
    
    const brazo =
        Math.floor(
            Math.random() * brazos
        );
    
    const angulo =
        (radio / radioMaximo) *
        Math.PI * 4 +
        (brazo / brazos) *
        Math.PI * 2 +
        (Math.random() - 0.5) * 0.8;

    nebulosa.position.set(
        Math.cos(angulo) * radio,
        (Math.random() - 0.5) * 30,
        Math.sin(angulo) * radio
    );

    const tamaño =
        80 +
        Math.random() * 100;

    nebulosa.scale.set(
        tamaño,
        tamaño,
        1
    );

    scene.add(nebulosa);

    nebulosas.push(nebulosa);
}

// ============================================
// CAPAS DE PROFUNDIDAD ESPACIAL
// ============================================

const capasEspaciales = [];

for (let i = 0; i < 900; i++) {

    const estrella =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.35,
                6,
                6
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity:
                    0.15 +
                    Math.random() * 0.35
            })
        );

    const radio =
        250 +
        Math.random() * 500;

    const angulo =
        Math.random() *
        Math.PI * 2;

    estrella.position.set(
        Math.cos(angulo) * radio,
        (Math.random() - 0.5) * 500,
        Math.sin(angulo) * radio
    );

    scene.add(estrella);

    capasEspaciales.push(estrella);
}

// ============================================
// ATMÓSFERA CÓSMICA
// ============================================

const atmosfera =
    new THREE.Mesh(
        new THREE.SphereGeometry(
            430,
            64,
            64
        ),
        new THREE.MeshBasicMaterial({
            color: 0x17102b,
            transparent: true,
            opacity: 0.2,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

scene.add(atmosfera);

// ============================================
// CORAZÓN DE LA GALAXIA
// ============================================

// ============================================
// AGUJERO NEGRO CENTRAL
// ============================================

const geometriaCorazon =
    new THREE.SphereGeometry(
        5,
        64,
        64
    );

const materialCorazon =
    new THREE.MeshBasicMaterial({
        color: 0x000000
    });

const corazon =
    new THREE.Mesh(
        geometriaCorazon,
        materialCorazon
    );

scene.add(corazon);

// ============================================
// RESPLANDOR SUTIL DEL AGUJERO NEGRO
// ============================================

const geometriaResplandor =
    new THREE.SphereGeometry(
        8,
        32,
        32
    );

const materialResplandor =
    new THREE.MeshBasicMaterial({
        color: 0xff9d4d,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const resplandor =
    new THREE.Mesh(
        geometriaResplandor,
        materialResplandor
    );

scene.add(resplandor);

// ============================================
// DISCO DE ACRECIÓN DEL AGUJERO NEGRO
// ============================================

const geometriaDisco =
    new THREE.TorusGeometry(
        7,
        0.65,
        24,
        160
    );

const materialDisco =
    new THREE.MeshBasicMaterial({
        color: 0xffb45c,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const disco =
    new THREE.Mesh(
        geometriaDisco,
        materialDisco
    );

// Inclinamos el disco para que parezca
// un disco de acreción visto en perspectiva
disco.rotation.x = Math.PI * 0.32;

scene.add(disco);


// ============================================
// DISCO INTERIOR MÁS BRILLANTE
// ============================================

const geometriaDiscoInterior =
    new THREE.TorusGeometry(
        6.2,
        0.22,
        16,
        160
    );

const materialDiscoInterior =
    new THREE.MeshBasicMaterial({
        color: 0xffe0a3,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const discoInterior =
    new THREE.Mesh(
        geometriaDiscoInterior,
        materialDiscoInterior
    );

discoInterior.rotation.x =
    Math.PI * 0.32;

scene.add(discoInterior);


// ============================================
// RESPLANDOR EXTERIOR DEL DISCO
// ============================================

const geometriaDiscoGlow =
    new THREE.TorusGeometry(
        7.4,
        1.0,
        16,
        160
    );

const materialDiscoGlow =
    new THREE.MeshBasicMaterial({
        color: 0xff8c32,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const discoGlow =
    new THREE.Mesh(
        geometriaDiscoGlow,
        materialDiscoGlow
    );

discoGlow.rotation.x =
    Math.PI * 0.32;

scene.add(discoGlow);

// ============================================
// HALO DEL CORAZÓN
// ============================================

/*const geometriaHalo =
    new THREE.SphereGeometry(
        9,
        32,
        32
    );

    const materialHalo =
    new THREE.MeshBasicMaterial({
        color: 0xffd98a,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const halo =
    new THREE.Mesh(
        geometriaHalo,
        materialHalo
    );

scene.add(halo);*/

// ============================================
// HALO EXTERIOR DEL NÚCLEO
// ============================================

const geometriaHaloExterior =
    new THREE.SphereGeometry(
        22,
        32,
        32
    );

const materialHaloExterior =
    new THREE.MeshBasicMaterial({
        color: 0xffb86b,
        transparent: true,
        opacity: 0.08,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

const haloExterior =
    new THREE.Mesh(
        geometriaHaloExterior,
        materialHaloExterior
    );

scene.add(haloExterior);

// ============================================
// NÚCLEO DE LA GALAXIA
// ============================================

const cantidadNucleo = 1500;

const posicionesNucleo =
    new Float32Array(cantidadNucleo * 3);

for (let i = 0; i < cantidadNucleo; i++) {

    const i3 = i * 3;

    // Distribución alrededor del centro
    const radio = Math.random() * 35;

    const angulo =
        Math.random() * Math.PI * 2;

    posicionesNucleo[i3] =
        Math.cos(angulo) * radio;

    posicionesNucleo[i3 + 1] =
        (Math.random() - 0.5) * 8;

    posicionesNucleo[i3 + 2] =
        Math.sin(angulo) * radio;
}

const nucleoGeometry =
    new THREE.BufferGeometry();

nucleoGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(
        posicionesNucleo,
        3
    )
);

const nucleoMaterial =
    new THREE.PointsMaterial({
        color: 0xfff1c1,
        size: 0.5,
        sizeAttenuation: true
    });

const nucleo =
    new THREE.Points(
        nucleoGeometry,
        nucleoMaterial
    );

//scene.add(nucleo);


// ============================================
// 8. ANIMACIÓN
// ============================================

function animate() {

    requestAnimationFrame(animate);

// ============================================
// VIAJE HACIA LA GALAXIA
// ============================================

if (viajeIniciado && !viajeFinalizado) {

    // Movemos la cámara directamente hacia
    // el centro de la galaxia.

    // Aceleramos progresivamente

    velocidadViaje += 0.02;


    // Movemos la cámara

    camera.position.z -= velocidadViaje;
    // ========================================
// EFECTO DE VELOCIDAD
// ========================================

for (const estrella of estrellasViaje) {

    estrella.position.z += velocidadViaje * 4;
        // Las estrellas se estiran cuando aumenta
    // la velocidad del viaje.

    const estiramiento =
        1 + velocidadViaje * 0.8;

    estrella.scale.z = estiramiento;

    // Si la estrella pasa detrás de la cámara,
    // la volvemos a colocar delante.

    if (estrella.position.z > camera.position.z + 20) {

        estrella.position.z =
            camera.position.z - 400;

        estrella.position.x =
            (Math.random() - 0.5) * 500;

        estrella.position.y =
            (Math.random() - 0.5) * 300;
    }
}
    // Cuando llegamos a esta distancia,
    // detenemos el viaje.

    // Al acercarnos a la galaxia,
// comenzamos a reducir la velocidad.

if (camera.position.z < 300) {
    velocidadViaje *= 0.96;
}

if (camera.position.z <= 180) {

    camera.position.z = 180;

    velocidadViaje = 0;

    viajeFinalizado = true;

    // Devolvemos el control al mouse
    controls.enabled = true;

    // Actualizamos los controles
    controls.target.set(0, 0, 0);
    controls.update();

    console.log("🌌 LLEGAMOS A LA GALAXIA");
}
}

    // ========================================
    // MOVIMIENTO DE LA GALAXIA
    // ========================================

    estrellas.rotation.y += 0.0003;
    estrellas.rotation.x += 0.0001;
    estrellasGrandes.rotation.y += 0.0003;
    polvo.rotation.y += 0.00025;
    nucleo.rotation.y += 0.0005;
    disco.rotation.z += 0.0008;
    discoInterior.rotation.z += 0.001;
    discoGlow.rotation.z += 0.0006;

    // El halo cambia suavemente de tamaño
/*const pulso =
1 + Math.sin(Date.now() * 0.002) * 0.08;

halo.scale.set(
pulso,
pulso,
pulso
);

haloExterior.scale.set(
    pulso * 1.05,
    pulso * 1.05,
    pulso * 1.05
);*/
// ========================================
// BRILLO DE LAS ESTRELLAS DE RECUERDOS
// ========================================

const brilloRecuerdos =
    0.85 +
    Math.sin(Date.now() * 0.003) * 0.15;

recuerdosMaterial.opacity =
    brilloRecuerdos;

    // ========================================
    // MOVIMIENTO SUAVE DE LA CÁMARA
    // ========================================

    controls.update();

    // ========================================
// VIAJE HACIA UN RECUERDO
// ========================================

// ========================================
// EFECTO DE LA ESTRELLA SELECCIONADA
// ========================================



if (viajando) {

    camera.position.lerp(
        objetivoCamara,
        0.03
    );

    controls.target.lerp(
        objetivoMira,
        0.03
    );

    controls.update();

    // Cuando estamos suficientemente cerca,
    // terminamos el viaje.

    if (
        camera.position.distanceTo(
            objetivoCamara
        ) < 0.5
    ) {

        viajando = false;
    }
}

        // ========================================
    // DIBUJAR
    // ========================================

    renderer.render(
        scene,
        camera
    );

}

// ============================================
// INICIAR ANIMACIÓN
// ============================================

animate();


// ============================================
// 9. ADAPTACIÓN A LA PANTALLA


// ============================================
// 9. ADAPTACIÓN A LA PANTALLA
// ============================================

window.addEventListener(
    'resize',
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;

        camera.updateProjectionMatrix();

        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );
    }
);
// ============================================
// CERRAR RECUERDO
// ============================================

// ============================================
// BOTÓN COMENZAR
// ============================================

document
    .getElementById('startButton')
    .addEventListener('click', () => {

        console.log("🚀 VIAJE INICIADO");

        // Reiniciamos el viaje
        viajeIniciado = true;
        viajeFinalizado = false;
        velocidadViaje = 0;

        // Ponemos la cámara nuevamente
        // en el punto inicial
        camera.position.set(0, 0, 700);

        // Miramos hacia el centro de la galaxia
        controls.target.set(0, 0, 0);

        // Desactivamos OrbitControls durante el viaje
        controls.enabled = false;
        controls.target.set(0, 0, 0);

        // Ocultamos la pantalla de inicio
        document
            .getElementById('introScreen')
            .classList.add('hidden');
    });
document
    .getElementById('closeMemory')
    .addEventListener('click', () => {

        document.getElementById(
            'memoryPanel'
        ).style.display = 'none';

        recuerdoSeleccionado = null;
    });