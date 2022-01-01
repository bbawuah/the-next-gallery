import * as THREE from 'three';

export interface CreativeType {
  slug: string;
  name: string;
  description: string;
  instagram?: string;
  coordinates: THREE.Vector3;
}

export const physicalObjects = ['randen', 'randen001', 'trap', 'tessalation-tent'];

export const portraitNames: CreativeType[] = [
  {
    slug: 'crystalina',
    name: 'Crystalina Agyeman',
    description: `
A lady who working hard on her dreams to become an news editor.
    `,
    instagram: 'https://www.instagram.com/icrystalina/?hl=nl',
    coordinates: new THREE.Vector3(15.009908246036689, 0, -6.938191632838113)
  },
  {
    slug: 'jamil',
    name: 'Jamil Mensah',
    instagram: 'https://www.instagram.com/men.sah/?hl=nl',
    description: `
    A multitalent. TV host, model, actor. An individual who focuses on whatever his heart leads him to.
    `,
    coordinates: new THREE.Vector3(10.766779209698752, 0, -3.2432525587517667)
  },
  {
    slug: 'terry',
    name: 'Terry Afram',
    description: `
    An entrepeneur with the focus to stimulate business in Ghana.
    `,
    instagram: 'https://www.instagram.com/terryquasi/?hl=nl',
    coordinates: new THREE.Vector3(1.1948243408823687, 0, -10.924579780892797)
  },
  {
    slug: 'darryl',
    name: 'Darryl Amankwah',
    description: `
    A young actor and journalist working hard to make an impact on his environment.
    `,
    instagram: 'https://www.instagram.com/darrylamankwah/?hl=nl',
    coordinates: new THREE.Vector3(-4.310308213360079, 0, -13.587756269419916)
  },
  {
    slug: 'meester-kwame',
    name: 'Meester Kwame',
    description: `
    A teacher, motivational speaker with the aim to inspire children to become their best self.
    `,
    instagram: 'https://www.instagram.com/meester_kwame/?hl=nl',
    coordinates: new THREE.Vector3(-8.777848451986934, 0, -9.58072077675611)
  },
  {
    slug: 'emmanuel',
    name: 'Emmanuel Owusu',
    description: `
    Co-Founder at Stichting the Rock Foundation. Helping the people in need in his environment.
    `,
    instagram: 'https://www.instagram.com/eaowusu/?hl=nl',
    coordinates: new THREE.Vector3(-14.17697527983192, 0, -6.359127050865383)
  },
  {
    slug: 'bonsu',
    name: 'Bonsu',
    description: `
   A multitalent who tells stories about his childhood in the form of music and acting
    `,
    instagram: 'https://www.instagram.com/bonsu.1/?hl=nl',
    coordinates: new THREE.Vector3(-10.902681629161126, 0, 4.298527213393908)
  },
  {
    slug: 'kwame',
    name: 'Kwame Boakye Agyeman',
    description: `
    An impactful young preacher, author and politician.
    `,
    instagram: 'https://www.instagram.com/kwameagyemann/?hl=nl',
    coordinates: new THREE.Vector3(-12.000644067788865, 0, 10.953168605207276)
  },
  {
    slug: 'othnell',
    description: `
    A talented music producer and mixer. Who has worked for numerous well known artists.
    `,
    name: 'Othnel "N64" Goodett',
    instagram: 'https://www.instagram.com/n64gram/?hl=nl',
    coordinates: new THREE.Vector3(-2.6532364563708195, 0, 15.032827562871368)
  },
  {
    slug: 'eben',
    name: 'Eben Badu',
    instagram: 'https://www.instagram.com/ebenbadu/?hl=nl',
    description: `
    An entrepeneur and co-founder of THE NEW ORIGINALS clothing brand.
    `,
    coordinates: new THREE.Vector3(2.889126442640087, 0, 11.158216004787308)
  },
  {
    slug: 'branko',
    description: `
    An MC for Afrolosjes who introduces his crowd to the African sound.
    `,
    name: 'Branko MC',
    instagram: 'https://www.instagram.com/brankomc/?hl=nl',
    coordinates: new THREE.Vector3(10.629905952617488, 0, 10.455758777354255)
  },
  {
    slug: 'dallis',
    name: 'Daliss',
    instagram: 'https://www.instagram.com/dalisshimself/?hl=nl',
    description: `
    A driven model and artist who is an inspiration to many with his talent, perseverance and positive vibe
    `,
    coordinates: new THREE.Vector3(10.886836730823616, 0, 3.788476742822992)
  },
  {
    slug: 'ronald',
    name: 'Ronald Gyamfi',
    instagram: 'https://www.instagram.com/mr.gyamfii/?hl=nl',
    description: `
    Creative director at Llandro Gyako
    `,
    coordinates: new THREE.Vector3(-7.115854867939999, 5.81, -1.4409451323676359)
  },
  {
    slug: 'kenneth',
    name: 'Kenneth Aidoo',
    description: `
    An artist who studies the positioning of dark-skinned people in society through film, paintings, drawings and video installations.
    `,
    instagram: 'https://www.instagram.com/kennethjames/?hl=nl',
    coordinates: new THREE.Vector3(-8.403389710785191, 5.81, 2.981797360254574)
  },
  {
    slug: 'junior',
    name: 'Junior Appiah',
    description: `
    An entrepeneur and co-founder of THE NEW ORIGINALS clothing brand.
    `,
    instagram: 'https://www.instagram.com/juniorappiah/?hl=nl',
    coordinates: new THREE.Vector3(-8.110173797429065, 5.81, 9.00672137486944)
  },
  {
    slug: 'porchia',
    name: 'Porchia Azieku',
    description: `
    Owner of PAB Design & Atarah Chai.
    `,
    instagram: 'https://www.instagram.com/porchiaab/?hl=nl',
    coordinates: new THREE.Vector3(-3.3782399803866245, 5.81, 11.798093011474574)
  },
  {
    slug: 'mirella',
    description: `
    Art director Mann Creative Studio.
    `,
    name: 'Mirella Agyemann',
    instagram: 'https://www.instagram.com/mirellaabn/?hl=nl',
    coordinates: new THREE.Vector3(2.906722722641966, 5.81, 8.961690212363647)
  },
  {
    slug: 'eboafo',
    name: 'Emmanuel Ohene Boafo',
    description: `
    An award winning Actor in films and series.
    `,
    instagram: 'https://www.instagram.com/eoboafo/?hl=nl',
    coordinates: new THREE.Vector3(-8.796496384646455, 5.81, -7.311549121881263)
  },
  {
    slug: 'denitio',
    name: 'Denitio Ravenberg',
    instagram: undefined,
    description: `
    A driven model and creative.
    `,
    coordinates: new THREE.Vector3(-3.6183742041848066, 5.81, -10.106474159702637)
  },
  {
    slug: 'churchbwoygram',
    name: 'Churchbwoygram',
    instagram: 'https://www.instagram.com/churchbwoygram/?hl=nl',
    description: `
    A talented music producer and mixer. Who has worked for numerous well known artists.
    `,
    coordinates: new THREE.Vector3(2.4798396318405023, 5.81, -8.044154207276335)
  }
];
