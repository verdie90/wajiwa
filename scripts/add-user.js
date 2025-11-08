const admin = require('firebase-admin')
const bcryptjs = require('bcryptjs')

// Firebase Admin SDK credentials
const serviceAccount = {
  type: 'service_account',
  project_id: 'jiwara-46f39',
  private_key_id: '794a4ab35de9c6023a37e19a181f016e2ff9ea0e',
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqQ7HEWW1Ur69o
RZ3ZEsMhHGxMMUJMrQUba0+ohghc0an+WI0vpRoDCno8VwcEW03ZtzquwesoA54L
PJNOOBDdN9h+LAMVk47PD+3TrsBpqfT0SESdSSTIHkf38puX7eV4WkkIucLfIPOT
HF7BeMbJ5rHquKfcMmIIcSwjyAxov2Dv65M3BbbU1hceuAVtKDfX3Euolz1VDXBf
0pB2pDrCAP+9cgCx1d9gWqHARnlz5nNnwtsQeu1ytqvh/W92hTQs6tGhOaIP1g23
+T2/6lQldslwiTWqs27SWH/6R6rHiL07sJa2+PrdMcItkFYAAeQ3P7L+XT5YdDD7
mfnp5P1fAgMBAAECggEAASyeWUBUpLThfNKeGBUtC1lq1cuxLV40HtBKqFrkS9+W
UI7DyoRU/Zhg53GiNsF6c/nziakEui3sNR+h1HRGiYANGjGrg8aUwZDWjxMxeIkX
i2fEMWGDw22SCX++2vllD8NvpYPCeE993pHfhW4T0OiqaXgEkFw4mN5O86A5la9Z
UbMpcpvmqmU9nqJOPUb2Qo/W9S18cWbXakWsIdP0ZzirSKvkDdHi+7C99f82JVj/
8rtqN/3GcKoL3aG5OPlrag+ZT3wdsKd1KReHX071cP8U17QmCLr+N3CsQCSkNRmu
htEgi9jLunYHVDAe8ZxGpKIMij7arDmGVUyrYKGSgQKBgQDqLI/bJ15zj1WaHIRO
jWjzLcVzLc94EGie6p5V2LJ1R7OBSnimfVdtx1iO5vzWaUFS7IgAFPjf3SltHOMh
d6WcmwfVvcqk3nlTKssZBsnOUHUpomnWMzjRcmA+I7LSiTMOnHBE9VoMWNXfVoAb
m6Xut6JJlLgvYeS/i27tcsTeMQKBgQC6Ijx8J89R1EfXsvPJO/Oi86k92a3urULw
iz4x1ohLm619sJwOeZ/4ojnGiVTiKJSI2HnAIgZW9rExW/2AkuYrHufe9L/hkiDM
XTbxRohPfFszv/fgGgMj7Q8WVPGH9wjd6jVaREJJjrD1+Vt7HE448sNCu4ueNeHR
QShmWSLgjwKBgQCu/tQWEuqLcw6mVy8sQJKwP4ExXIeREroMIApo3sIl0Io9UTiu
Ojauq+zrBYTmecu+O1I6tXFyYaTGjHLTnMTfLh+BxA3+fN6vnugdcKw4iHm1vlBX
KPoJ0u5HIYhNuwezoIZpkexUE8Ln3o1nlD5BEWuujvvBNOermHgx67Vg0QKBgEsk
MRjKFXbqZMpeMu6FJlkdVrBiZUYaahCjlcsW2VT0lvhLyORLE1qTWxGcNUlLqpMI
GTaIRdjrpCLSCSfTpdm4k1C9q4zLqjP2WYzTtYmpIURl9hJhTe098T5Jsmv6PXkg
6ML1FXGOij/yl4y+o5F3533UKowHIo+QZ1fSGjNfAoGAAuqeD3aHSATAqeCxjesF
i0hJ1WEyw0e6G3FNoAM35iHHT7c5Xk5Zz6dlDNlG4mWwK8QFGSIWVupbz9wgGcV/
GuEK6rgQa08qXOfNFSi53kFnnCb/ByQAZXU6jeK2nhTIss45nNmIz+x1YN8N2f7/
fp+RZ8pu12VTm61PzM8QxBI=
-----END PRIVATE KEY-----`,
  client_email: 'firebase-adminsdk-fbsvc@jiwara-46f39.iam.gserviceaccount.com',
  client_id: '110157917073792929857',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40jiwara-46f39.iam.gserviceaccount.com',
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function addCustomUser() {
  try {
    console.log('Adding custom user to Firestore...')

    // Hash password
    const salt = await bcryptjs.genSalt(10)
    const hashedPassword = await bcryptjs.hash('5T41nl355!', salt)

    const now = new Date()

    const userData = {
      email: 'ferdian3113@gmail.com',
      name: 'Ferdian',
      password: hashedPassword,
      role: 'owner',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      lastLogin: null,
    }

    // Add user to Firestore
    const docRef = await db.collection('users').add(userData)

    console.log('✅ User added successfully!')
    console.log('User ID:', docRef.id)
    console.log('Email:', userData.email)
    console.log('Name:', userData.name)
    console.log('Role:', userData.role)
    console.log('Active:', userData.isActive)

    process.exit(0)
  } catch (error) {
    console.error('❌ Error adding user:', error)
    process.exit(1)
  }
}

addCustomUser()
