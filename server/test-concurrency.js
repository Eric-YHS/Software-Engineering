const axios = require('axios');
const API_BASE_URL = 'http://localhost:3001/api';

async function runConcurrencyTest() {
    console.log('Starting concurrency test...');

    // --- 1. Register and Login Users ---
    console.log('\n--- Registering and Logging in Users ---');
    const adminCredentials = { username: 'testadmin', password: 'password', role: 'admin' };
    const leaderCredentials = { username: 'testleader', password: 'password', role: 'leader', phone: '1234567890' };
    const customerCount = 10;
    const customerCredentials = [];

    // Register & Login Admin
    try {
        await axios.post(`${API_BASE_URL}/auth/register`, adminCredentials);
    } catch (e) { /* Assume already registered */ }
    const adminLogin = await axios.post(`${API_BASE_URL}/auth/login`, adminCredentials);
    const adminToken = adminLogin.data.token;
    console.log('Admin logged in.');

    // Register & Login Leader
    try {
        await axios.post(`${API_BASE_URL}/auth/register`, leaderCredentials);
    } catch (e) { /* Assume already registered */ }
    const leaderLogin = await axios.post(`${API_BASE_URL}/auth/login`, leaderCredentials);
    const leaderToken = leaderLogin.data.token;
    const leaderUserId = leaderLogin.data.user.id;
    console.log('Leader logged in.');

    // Register & Login Customers
    for (let i = 1; i <= customerCount; i++) {
        const cred = { username: `customer${i}`, password: 'password', role: 'customer', phone: `098765432${i}` };
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, cred);
        } catch (e) { /* Assume already registered */ }
        const loginRes = await axios.post(`${API_BASE_URL}/auth/login`, cred);
        customerCredentials.push({ ...cred, token: loginRes.data.token, id: loginRes.data.user.id });
    }
    console.log(`${customerCount} customers logged in.`);

    // --- 2. Admin Creates Product, Group Buy, and Station ---
    console.log('\n--- Admin Creating Product, Group Buy, and Station ---');

    // Create Product
    const productData = {
        name: 'Concurrency Test Item',
        description: 'Item for testing concurrent orders',
        category: 'Test',
        base_price: 10.00,
        shelf_life_days: 7,
        image_url: 'https://via.placeholder.com/150?text=TestItem'
    };
    let productId;
    try {
        const productRes = await axios.post(`${API_BASE_URL}/admin/products`, productData, { headers: { Authorization: `Bearer ${adminToken}` } });
        productId = productRes.data.id;
        console.log(`Product created with ID: ${productId}`);
    } catch (e) {
        // Assume product might exist, try to fetch it
        const productsRes = await axios.get(`${API_BASE_URL}/products`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const existingProduct = productsRes.data.find(p => p.name === productData.name);
        if (existingProduct) {
            productId = existingProduct.id;
            console.log(`Using existing product with ID: ${productId}`);
        } else {
            console.error('Failed to create or find test product. Exiting.', e.response?.data || e.message);
            return;
        }
    }

    // Create Group Buy
    const groupBuyData = {
        title: 'Concurrency Test Group Buy',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
        status: 'active'
    };
    let groupBuyId;
    try {
        const groupBuyRes = await axios.post(`${API_BASE_URL}/admin/group-buys`, groupBuyData, { headers: { Authorization: `Bearer ${adminToken}` } });
        groupBuyId = groupBuyRes.data.id;
        console.log(`Group Buy created with ID: ${groupBuyId}`);
    } catch (e) {
        const groupBuysRes = await axios.get(`${API_BASE_URL}/group-buys`, { headers: { Authorization: `Bearer ${adminToken}` } });
        const existingGroupBuy = groupBuysRes.data.find(gb => gb.title === groupBuyData.title);
        if (existingGroupBuy) {
            groupBuyId = existingGroupBuy.id;
            console.log(`Using existing Group Buy with ID: ${groupBuyId}`);
        } else {
            console.error('Failed to create or find test group buy. Exiting.', e.response?.data || e.message);
            return;
        }
    }

    // Add Product to Group Buy
    const initialStock = 5; // Stock for the group buy item
    try {
        await axios.post(`${API_BASE_URL}/admin/group-buys/${groupBuyId}/items`, {
            product_id: productId,
            price: 8.00, // Deal price
            stock: initialStock
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log(`Product ${productId} added to Group Buy ${groupBuyId} with stock ${initialStock}.`);
    } catch (e) {
        console.error('Error adding product to group buy (might already exist):', e.response?.data?.error || e.message);
        // Assuming it's already there with some stock
    }

    // Create Station
    const stationData = {
        leader_id: leaderUserId,
        name: 'Test Leader Station',
        address: '123 Test Street'
    };
    let stationId;
    try {
        const stationRes = await axios.post(`${API_BASE_URL}/admin/stations`, stationData, { headers: { Authorization: `Bearer ${adminToken}` } });
        stationId = stationRes.data.id;
        console.log(`Station created with ID: ${stationId}`);
    } catch (e) {
        // Assume station might exist, fetch it
        const leaderStationsRes = await axios.get(`${API_BASE_URL}/leader/my-stations`, { headers: { Authorization: `Bearer ${leaderToken}` } });
        const existingStation = leaderStationsRes.data.find(s => s.name === stationData.name);
        if (existingStation) {
            stationId = existingStation.id;
            console.log(`Using existing station with ID: ${stationId}`);
        } else {
            console.error('Failed to create or find test station. Exiting.', e.response?.data || e.message);
            return;
        }
    }


    // --- 3. Simulate Concurrent Orders ---
    console.log('\n--- Simulating Concurrent Orders ---');
    const orderPromises = [];
    const itemToOrder = { product_ids: [productId], quantities: [1] }; // Each customer tries to buy 1 item

    for (const customer of customerCredentials) {
        orderPromises.push(
            axios.post(
                `${API_BASE_URL}/orders`,
                { station_id: stationId, group_buy_id: groupBuyId, ...itemToOrder },
                { headers: { Authorization: `Bearer ${customer.token}` } }
            ).then(res => {
                console.log(`Customer ${customer.username} placed order successfully.`);
                return { customer: customer.username, status: 'success' };
            }).catch(err => {
                console.error(`Customer ${customer.username} failed to place order:`, err.response?.data?.error || err.message);
                return { customer: customer.username, status: 'failure', error: err.response?.data?.error || err.message };
            })
        );
    }

    const results = await Promise.all(orderPromises);
    console.log('\n--- Concurrency Test Results ---');
    results.forEach(res => console.log(res));

    // --- 4. Verify Final Stock and Orders ---
    console.log('\n--- Verifying Final Stock and Orders ---');
    const groupBuyItems = await axios.get(`${API_BASE_URL}/group-buys/${groupBuyId}/items`);
    const finalStock = groupBuyItems.data.find(item => item.product_id === productId);
    console.log(`Final stock for product ${productId} in Group Buy ${groupBuyId}: ${finalStock.stock}`);
    console.log(`Sold count for product ${productId} in Group Buy ${groupBuyId}: ${finalStock.sold_count}`);

    const successfulOrders = results.filter(r => r.status === 'success').length;
    console.log(`Successful orders: ${successfulOrders}`);
    console.log(`Expected final stock: ${initialStock - successfulOrders}`);

    if (finalStock.stock === (initialStock - successfulOrders)) {
        console.log('Stock deduction is consistent. Concurrency test PASSED!');
    } else {
        console.error('Stock deduction is INCONSISTENT. Concurrency test FAILED!');
    }
}

// Ensure the server is running before executing this script
// You might need to manually ensure the database is reset before each run for clean tests
runConcurrencyTest();