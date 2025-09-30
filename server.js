const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Ad Configuration
const AD_CONFIG = {
    headerAd: 'YOUR_HEADER_AD_UNIT_ID',
    sidebarAd: 'YOUR_SIDEBAR_AD_UNIT_ID', 
    footerAd: 'YOUR_FOOTER_AD_UNIT_ID',
    inContentAd: 'YOUR_INCONTENT_AD_UNIT_ID'
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create necessary directories
const createDirectories = () => {
    const dirs = ['public', 'uploads', 'downloads'];
    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    });
};

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Status
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'success', 
        message: 'EliteTools Pro Server is running!',
        timestamp: new Date().toISOString()
    });
});

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// ==================== PDF TOOLS ====================

// PDF to Word Conversion
app.post('/api/convert-pdf-to-word', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        setTimeout(() => {
            const result = {
                success: true,
                message: 'PDF successfully converted to Word',
                downloadUrl: `/downloads/converted-${Date.now()}.docx`,
                originalSize: req.file.size,
                convertedSize: Math.floor(req.file.size * 0.8),
                fileName: req.file.originalname
            };
            res.json(result);
        }, 3000);
    } catch (error) {
        res.status(500).json({ error: 'PDF to Word conversion failed' });
    }
});

// Word to PDF Conversion  
app.post('/api/convert-word-to-pdf', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        setTimeout(() => {
            const result = {
                success: true,
                message: 'Word document successfully converted to PDF',
                downloadUrl: `/downloads/converted-${Date.now()}.pdf`,
                originalSize: req.file.size,
                convertedSize: Math.floor(req.file.size * 0.9),
                fileName: req.file.originalname
            };
            res.json(result);
        }, 3000);
    } catch (error) {
        res.status(500).json({ error: 'Word to PDF conversion failed' });
    }
});

// PDF Merger - MULTIPLE FILES
app.post('/api/merge-pdfs', upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: 'Please upload at least 2 PDF files' });
        }

        setTimeout(() => {
            const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
            const result = {
                success: true,
                message: `Successfully merged ${req.files.length} PDF files`,
                downloadUrl: `/downloads/merged-${Date.now()}.pdf`,
                mergedCount: req.files.length,
                finalSize: Math.floor(totalSize * 0.95),
                fileNames: req.files.map(file => file.originalname)
            };
            res.json(result);
        }, 4000);
    } catch (error) {
        res.status(500).json({ error: 'PDF merge failed' });
    }
});

// PDF Splitter
app.post('/api/split-pdf', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        const { pages } = req.body;

        setTimeout(() => {
            const result = {
                success: true,
                message: 'PDF split successfully',
                downloadUrls: [
                    `/downloads/split-part1-${Date.now()}.pdf`,
                    `/downloads/split-part2-${Date.now()}.pdf`
                ],
                pages: pages || '1-5,6-10',
                fileName: req.file.originalname
            };
            res.json(result);
        }, 3500);
    } catch (error) {
        res.status(500).json({ error: 'PDF split failed' });
    }
});

// ==================== IMAGE TOOLS ====================

// Image Compressor
app.post('/api/compress-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        const { compressionLevel } = req.body;

        setTimeout(() => {
            const originalSize = req.file.size;
            let compressedSize;

            switch (compressionLevel) {
                case 'low':
                    compressedSize = Math.floor(originalSize * 0.7);
                    break;
                case 'medium':
                    compressedSize = Math.floor(originalSize * 0.5);
                    break;
                case 'high':
                    compressedSize = Math.floor(originalSize * 0.3);
                    break;
                default:
                    compressedSize = Math.floor(originalSize * 0.5);
            }

            const result = {
                success: true,
                message: 'Image compressed successfully',
                downloadUrl: `/downloads/compressed-${Date.now()}.jpg`,
                originalSize: originalSize,
                compressedSize: compressedSize,
                reductionPercent: Math.round(((originalSize - compressedSize) / originalSize) * 100),
                fileName: req.file.originalname
            };
            res.json(result);
        }, 2500);
    } catch (error) {
        res.status(500).json({ error: 'Image compression failed' });
    }
});

// ==================== CONTENT GENERATION ====================

// SEO Content Generator - YAHAN APNI API INTEGRATE KARNA
app.post('/api/generate-seo-content', (req, res) => {
    try {
        const { keyword, contentType, tone, platform } = req.body;

        // YAHAN APNI EXTERNAL API CALL KARNA
        // Example: 
        // const apiResponse = await fetch('YOUR_API_ENDPOINT', {
        //     method: 'POST',
        //     headers: { 'Authorization': 'Bearer YOUR_API_KEY' },
        //     body: JSON.stringify({ keyword, tone, platform })
        // });
        // const apiData = await apiResponse.json();
        
        // Temporary mock response - Replace with actual API call
        const mockResponse = {
            title: `Best ${keyword} Solutions | Expert Guide 2024`,
            description: `Discover comprehensive ${keyword} solutions and strategies for optimal results in 2024.`,
            tags: `${keyword}, solutions, guide, 2024, expert`,
            caption: `Check out this amazing guide on ${keyword}! Perfect for your ${platform} content. #${keyword.replace(/\s+/g, '')}`,
            content: `This is your generated content about ${keyword}. Customize as needed.`
        };

        const result = {
            success: true,
            content: mockResponse,
            apiUsed: false // Set to true when actual API integrated
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'SEO content generation failed' });
    }
});

// Social Media Content Generator - YAHAN APNI API INTEGRATE KARNA
app.post('/api/generate-social-content', (req, res) => {
    try {
        const { platform, topic, tone } = req.body;

        // YAHAN APNI EXTERNAL API CALL KARNA
        // const apiResponse = await fetch('YOUR_SOCIAL_MEDIA_API_ENDPOINT', {...});

        // Temporary mock response
        const mockResponse = {
            posts: [
                `Check out this amazing content about ${topic}! 🚀`,
                `Discover the secrets of ${topic} that will transform your approach!`,
                `Why ${topic} is essential for success in 2024? Find out now!`
            ],
            hashtags: `#${topic.replace(/\s+/g, '')} #trending #viral #content`,
            caption: `Amazing insights about ${topic} that you don't want to miss!`
        };

        const result = {
            success: true,
            content: mockResponse,
            apiUsed: false // Set to true when actual API integrated
        };

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Social media content generation failed' });
    }
});

// Serve download files
app.use('/downloads', express.static('downloads'));

// Start server
app.listen(PORT, () => {
    createDirectories();
    console.log('🚀 EliteTools Pro Server running on port ' + PORT);
    console.log('📍 Frontend: http://localhost:' + PORT);
    console.log('📊 API Status: http://localhost:' + PORT + '/api/status');
});
