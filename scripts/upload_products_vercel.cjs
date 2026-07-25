const fs = require('fs');

const URL = "http://3.95.240.195/api/products";

const products = [
    {"name": "Wireless Bluetooth Earbuds", "description": "High quality wireless earbuds with active noise cancellation and 24h battery life.", "price": 49.99, "stockQuantity": 150, "category": "Electronics", "brand": "AudioTech"},
    {"name": "Smart Watch Series 7", "description": "Latest smartwatch with health tracking, ECG, and always-on display.", "price": 199.99, "stockQuantity": 85, "category": "Electronics", "brand": "Wearables Inc"},
    {"name": "Men's Classic Leather Jacket", "description": "Genuine leather jacket for men. Perfect for winter and stylish look.", "price": 120.00, "stockQuantity": 40, "category": "Clothing", "brand": "UrbanStyle"},
    {"name": "Women's Running Shoes", "description": "Lightweight and breathable running shoes designed for marathon runners.", "price": 89.95, "stockQuantity": 200, "category": "Footwear", "brand": "PaceMaker"},
    {"name": "4K Ultra HD Smart TV", "description": "55-inch 4K UHD Smart TV with built-in streaming apps and HDR10.", "price": 450.00, "stockQuantity": 20, "category": "Electronics", "brand": "Visionary"},
    {"name": "Professional DSLR Camera", "description": "24.2 MP DSLR camera with 18-55mm lens and 4K video recording.", "price": 650.00, "stockQuantity": 15, "category": "Photography", "brand": "ClickPro"},
    {"name": "Organic Cotton T-Shirt", "description": "Soft, 100% organic cotton unisex t-shirt. Eco-friendly and comfortable.", "price": 19.99, "stockQuantity": 500, "category": "Clothing", "brand": "EcoWear"},
    {"name": "Gaming Laptop 15.6\"", "description": "High-performance gaming laptop with RTX 4060, 16GB RAM, and 512GB SSD.", "price": 1050.00, "stockQuantity": 30, "category": "Computers", "brand": "GameMaster"},
    {"name": "Stainless Steel Water Bottle", "description": "Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.", "price": 24.99, "stockQuantity": 300, "category": "Accessories", "brand": "HydroChill"},
    {"name": "Noise Cancelling Headphones", "description": "Over-ear headphones with industry-leading noise cancellation and deep bass.", "price": 149.99, "stockQuantity": 60, "category": "Electronics", "brand": "SoundWave"}
];

async function uploadProducts() {
    console.log("Starting to upload 10 products via Vercel Proxy...");

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        console.log(`Uploading product ${i + 1}: ${product.name}`);

        try {
            // Download a random placeholder image
            const imgResp = await fetch(`https://picsum.photos/600/400?random=${i}`);
            const imgBlob = await imgResp.blob();

            const formData = new FormData();
            formData.append('images', imgBlob, 'image.jpg');
            formData.append('product', JSON.stringify(product));

            const response = await fetch(URL, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                console.log(`✅ Successfully uploaded: ${product.name}`);
            } else {
                const text = await response.text();
                console.log(`❌ Failed to upload: ${product.name}. Status: ${response.status}, Response: ${text}`);
            }
        } catch (error) {
            console.log(`❌ Error uploading ${product.name}: ${error.message}`);
        }
        
        // Wait 1 second
        await new Promise(r => setTimeout(r, 1000));
    }
    console.log("Finished uploading!");
}

uploadProducts();
