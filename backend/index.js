const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');
const app = express();
const port = 4001;

const Message = require('./models/messageModel');
const messageRoutes = require('./routes/messageRoutes');

app.use(cors());
app.use(express.json());
app.use('/messages', messageRoutes);

mongoose.connect('mongodb://localhost:27017/myNewDatabase', {useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(error => console.error('Could not connect to MongoDB', error));

app.get('/api/items', (req, res) => {
    fs.readFile('../data/test.js', 'utf8', (err, data) => {
      if (err) {
        console.log('Error reading file:', err);
        res.status(500).send('Server error');
        return;
      }
      try {
        const items = JSON.parse(data);
        res.json(items);
      } catch (error) {
        console.error('解析JSON时出错:', error);
        res.status(500).send('Error parsing JSON');
      }
    });
  });

app.get('/api/curated-knowledge',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S1_browse_lesion.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            // 使用 xlsx 库解析文件
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
      
            // 发送解析后的数据
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/bulk',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S2_bulk_datasets.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            // 使用 xlsx 库解析文件
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; // 获取第一个工作表的名称
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
      
            // 发送解析后的数据
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/bulk/pie-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S5_bulk_samples_piechart.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/bulk/line-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S7_bulk_zhexian.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/bulk/volcano-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S6_bulk_deg_volcano.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/bulk/column-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S9_bulk_deconv_hist.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/single-cell',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S3_sc_datasets.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/single-cell/scatter-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S11_sc_scatter.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/single-cell/column-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S14_sc_compartment_hist.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/single-cell/traj-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S15_sc_tranj_scatter.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/GEA/UMAP-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S23_sc_gene_scatter.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});

app.get('/api/DGA/traj-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S25_sc_gene_scatter.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});

app.get('/api/CCA/bulk-boxplot-chart',(req,res)=>{
    const filePath = path.join(__dirname,'../data/S10_bulk_deconv_boxplot.xlsx');
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log('Error reading file:',err);
            res.status(500).send('Server error');
            return;
        }
        try {
            const workbook = xlsx.read(data, { type: 'buffer' });
            const firstSheetName = workbook.SheetNames[0]; 
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            res.json(jsonData);
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            res.status(500).send('Error parsing Excel file');
          }
    });
});
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});
app.get('/check-messages', async (req, res) => {
    const messages = await Message.find();
    if (messages.length === 0) {
        res.send('No messages in the database.');
    } else {
        res.send(`There are ${messages.length} messages in the database.`);
    }
});

app.get('/search', async (req, res) => {
    const query = req.query;
    const messages = await Message.find({
        text: {
            $regex: query.q,
            $options: 'i'
        }
    });
});

app.get('/messages', async (req, res) => {
    const messages = await Message.find();
    res.send(messages);
});

app.post('/messages', async (req, res) => {
    const message = new Message(req.body);
    await message.save();
    res.status(201).send(message);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
