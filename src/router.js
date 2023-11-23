import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { preparePath } from './utils/preparePath.js'

const database = new Database()
const tableName = 'task'

export const routes = [
  {
    method: 'GET',
    path: preparePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query
      const tasks = database.select(tableName, search ? {
        title: search,
        description: search
      } : null, null)
      return res.setHeader('Content-type', 'application/json').end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: preparePath('/tasks'),
    handler: (req, res) => {
      const {title, description} = req.body
      const task = {
        id: randomUUID(), 
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      }
      const data = database.insert(tableName, task)
      return res.writeHead(201).end(JSON.stringify(data))
    }
  },
  {
    method: 'DELETE',
    path: preparePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const itemToDelete = database.select(tableName, null, id)[0]
      if (itemToDelete) {
        database.delete(tableName, id)
        return res.writeHead(200).end("Item deleted")
      } else {
        return res.writeHead(404).end("Item not found")
      }      
    }
  },
  {
    method: 'PUT',
    path: preparePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body
      const itemToUpdate = database.select(tableName, null, id)[0]
      
      if (itemToUpdate) {
        if (title) itemToUpdate.title = title
        if (description) itemToUpdate.description = description
        itemToUpdate.updated_at = new Date()   
        database.update(tableName, itemToUpdate, id)
        return res.writeHead(200).end("Item updated")     
      } 

      return res.writeHead(404).end("Item not found")
    }
  },
  {
    method: 'PATCH',
    path: preparePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const itemToPatch = database.select(tableName, null, id)[0]
      
      if (itemToPatch) {
        itemToPatch.completed_at = new Date()
        database.update(tableName, itemToPatch, id)
        return res.writeHead(200).end("Task completed")
      } else {
        return res.writeHead(404).end("Task not found")
      }
    }
  }
]