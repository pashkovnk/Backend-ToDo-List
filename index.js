import express from 'express';
import { Sequelize, DataTypes } from 'sequelize';

const app = express();
const PORT = 3000;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './sqliteData/ToDoshkeee.db'
});

const ToDo = sequelize.define('ToDo', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isDone: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

ToDo.sync();

app.use(express.json());

app.get('/api/todos', async (req, res) => {
    try {
        const todos = await ToDo.findAll();
        res.json(todos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.get('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await ToDo.findByPk(id);
        if (todo) {
            res.json(todo);
        } else {
            res.status(404).json({ error: 'ToDo не найдено' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.post('/api/todos', async (req, res) => {
    const { title, description, isDone } = req.body;
    try {
        const todo = await ToDo.create({ title, description, isDone });
        res.json(todo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.patch('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, isDone } = req.body;
    try {
        const todo = await ToDo.findByPk(id);
        if (todo) {
            todo.title = title || todo.title;
            todo.description = description || todo.description;
            todo.isDone = isDone || todo.isDone;
            await todo.save();
            res.json(todo);
        } else {
            res.status(404).json({ error: 'ToDo не найдено' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await ToDo.findByPk(id);
        if (todo) {
            await todo.destroy();
            res.json({ message: 'ToDo удалено успешно' });
        } else {
            res.status(404).json({ error: 'ToDo не найдено' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.delete('/api/todos', async (req, res) => {
    try {
        await ToDo.destroy({ where: {} });
        res.json({ message: 'Все ToDo удалены успешно' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

