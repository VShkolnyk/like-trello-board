import express from 'express'
import cors from 'cors'
import bodyParser from "body-parser";

const port = process.env.PORT || 3000;

const app = express()
app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

const lists = [];

app.get('/', (req, res) => {
    res.status(200).json('Server work')
})

app.get('/lists', (req, res) => {
    res.status(200).send(lists);
})

app.post('/lists', (req, res) => {
    const list = req.body
    lists.push(list)
    res.status(201).send(lists)
})

app.delete('/lists/delete/:idx', (req, res) => {
    const idx = req.params.idx
    lists.splice(idx, 1)
    res.status(201).send(lists)
})

app.post('/lists/:idx/cards', (req, res) => {
    const card = req.body
    const idx = req.params.idx
    lists[idx].cards.push(card)
    res.status(201).send(lists)
})

app.delete('/lists/:idx/cards/delete/:index', (req, res) => {
    const idx = req.params.idx;
    const index = req.params.index;
    lists[idx].cards.splice(index, 1)
    res.status(201).send(lists)
})

app.post('/lists/:idx/drop', (req, res) => {
    const idx = req.params.idx;
    lists[idx].cards.push(req.body)
    res.status(201).send(lists)
})

app.post('/lists/:idx/cards/:index/drag', (req, res) => {
    const idx = req.params.idx;
    const index = req.params.index;
    const item = lists[idx].cards
    item.splice(item.indexOf(item[index]), 1)
    res.status(201).send(lists)
})

app.listen(port, () => console.log('server start on port ' + port))