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
  universe_domain: 'googleapis.com',
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const db = admin.firestore()

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n')

    // Hash passwords
    const adminPassword = await bcryptjs.hash('Admin@123456', 10)
    const managerPassword = await bcryptjs.hash('Manager@123456', 10)
    const agentPassword = await bcryptjs.hash('Agent@123456', 10)

    // Create roles with permissions
    console.log('📋 Creating roles...')
    await db.collection('roles').add({
      name: 'admin',
      description: 'Administrator with full access',
      permissions: [
        { resource: 'dashboard', action: 'read' },
        { resource: 'users', action: 'read' },
        { resource: 'users', action: 'create' },
        { resource: 'users', action: 'update' },
        { resource: 'users', action: 'delete' },
        { resource: 'campaigns', action: 'read' },
        { resource: 'campaigns', action: 'create' },
        { resource: 'campaigns', action: 'update' },
        { resource: 'campaigns', action: 'delete' },
        { resource: 'whatsapp', action: 'read' },
        { resource: 'whatsapp', action: 'create' },
        { resource: 'whatsapp', action: 'update' },
        { resource: 'crm', action: 'read' },
        { resource: 'crm', action: 'create' },
        { resource: 'crm', action: 'update' },
        { resource: 'ai-agents', action: 'read' },
        { resource: 'ai-agents', action: 'create' },
        { resource: 'ai-agents', action: 'update' },
        { resource: 'team', action: 'read' },
        { resource: 'team', action: 'create' },
        { resource: 'team', action: 'update' },
        { resource: 'team', action: 'delete' },
        { resource: 'settings', action: 'read' },
        { resource: 'settings', action: 'update' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection('roles').add({
      name: 'manager',
      description: 'Manager with team and campaign management',
      permissions: [
        { resource: 'dashboard', action: 'read' },
        { resource: 'users', action: 'read' },
        { resource: 'campaigns', action: 'read' },
        { resource: 'campaigns', action: 'create' },
        { resource: 'campaigns', action: 'update' },
        { resource: 'whatsapp', action: 'read' },
        { resource: 'crm', action: 'read' },
        { resource: 'crm', action: 'create' },
        { resource: 'crm', action: 'update' },
        { resource: 'ai-agents', action: 'read' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection('roles').add({
      name: 'agent',
      description: 'Agent with messaging and basic access',
      permissions: [
        { resource: 'dashboard', action: 'read' },
        { resource: 'whatsapp', action: 'read' },
        { resource: 'crm', action: 'read' },
        { resource: 'crm', action: 'create' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('✅ Roles created successfully\n')

    // Create demo users
    console.log('👥 Creating demo users...')
    await db.collection('users').add({
      email: 'admin@wajiwa.com',
      password: adminPassword,
      role: 'admin',
      name: 'Admin User',
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection('users').add({
      email: 'manager@wajiwa.com',
      password: managerPassword,
      role: 'manager',
      name: 'Manager User',
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection('users').add({
      email: 'agent@wajiwa.com',
      password: agentPassword,
      role: 'agent',
      name: 'Agent User',
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('✅ Demo users created successfully\n')

    // Create sample contacts
    console.log('📇 Creating sample contacts...')
    await db.collection('contacts').add({
      name: 'John Doe',
      phone: '+1234567890',
      email: 'john@example.com',
      status: 'active',
      labels: ['VIP', 'Customer'],
      lastMessage: new Date(),
      createdAt: new Date(),
    })

    await db.collection('contacts').add({
      name: 'Jane Smith',
      phone: '+0987654321',
      email: 'jane@example.com',
      status: 'active',
      labels: ['Prospect'],
      lastMessage: new Date(),
      createdAt: new Date(),
    })

    await db.collection('contacts').add({
      name: 'Bob Johnson',
      phone: '+1122334455',
      email: 'bob@example.com',
      status: 'inactive',
      labels: ['Lead'],
      lastMessage: new Date(),
      createdAt: new Date(),
    })

    console.log('✅ Sample contacts created successfully\n')

    // Create sample campaigns
    console.log('📢 Creating sample campaigns...')
    await db.collection('campaigns').add({
      name: 'Welcome Campaign',
      message: 'Welcome to our service! We are excited to have you on board.',
      status: 'running',
      targetAudience: ['VIP', 'Customer'],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await db.collection('campaigns').add({
      name: 'Spring Promotion',
      message: 'Special spring offer: 30% off on all services!',
      status: 'scheduled',
      targetAudience: ['Prospect'],
      scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('✅ Sample campaigns created successfully\n')

    // Create WhatsApp account
    console.log('📱 Creating WhatsApp account...')
    await db.collection('whatsapp_accounts').add({
      name: 'Main Account',
      accountId: 'WATEST123456',
      phoneNumber: '1234567890',
      status: 'connected',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('✅ WhatsApp account created successfully\n')

    // Create AI Agent
    console.log('🤖 Creating AI Agent...')
    await db.collection('ai_agents').add({
      name: 'Support Bot',
      description: 'AI-powered customer support assistant',
      model: 'gpt-3.5-turbo',
      prompt:
        'You are a helpful customer support assistant. Help customers with their inquiries.',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log('✅ AI Agent created successfully\n')

    console.log('🎉 Database seeding completed successfully!\n')
    console.log('📝 Demo Credentials:')
    console.log('   Admin:   admin@wajiwa.com / Admin@123456')
    console.log('   Manager: manager@wajiwa.com / Manager@123456')
    console.log('   Agent:   agent@wajiwa.com / Agent@123456\n')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
