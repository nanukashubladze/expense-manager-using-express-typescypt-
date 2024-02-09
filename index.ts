import express, { Request, Response } from 'express';

const port: number = 3000;
const app = express();

interface Expense {
  id: number;
  name: string;
  cost: number;
  createdAt: string;
}

const expense: Expense[] = [{
  id: 1,
  name: 'notebook',
  cost: 3500,
  createdAt: '09-05-2023'
}];

app.use(express.json());

app.get('/api/expense', (req: Request, res: Response): void => {
  res.json({ success: true, data: expense });
});

app.get('/api/expense/:id', (req: Request, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const foundExpense: Expense | undefined = expense.find(item => item.id === id);
  if (foundExpense) {
    const expenseHtml: string = `
      <html>
        <body>
          <p>ID: ${foundExpense.id}</p>
          <p>Name: ${foundExpense.name}</p>
          <p>Cost: $${foundExpense.cost}</p>
          <p>Created At: ${foundExpense.createdAt}</p>
        </body>
      </html>
    `;
    res.send(expenseHtml);
  } else {
    res.status(404).send('<html><body><h1>Expense not found</h1></body></html>');
  }
});

app.post('/api/expense', (req: Request, res: Response): void => {
  const expenses: Expense = req.body;
  const lastId: number | undefined = expense[expense.length - 1]?.id;
  expenses.id = lastId ? lastId + 1 : 1;
  expense.push(expenses);
  res.send({ data: expenses });
});

app.put('/api/expense/:id', (req: Request, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const index: number = expense.findIndex(item => item.id === id);
  if (index !== -1) {
    const updatedExpense: Expense = { ...expense[index], ...req.body };
    expense[index] = updatedExpense;
    res.send({ message: `Expense with ID ${id} updated successfully`, updatedExpense });
  } else {
    res.status(404).send({ message: `Expense with the ID ${id} was not found!` });
  }
});

app.delete('/api/expense/:id', (req: Request, res: Response): void => {
  const id: number = parseInt(req.params.id);
  const index: number = expense.findIndex(item => item.id === id);
  if (index !== -1) {
    expense.splice(index, 1); 
    res.send({ message: `Expense with ID ${id} deleted successfully` });
  } else {
    res.send({ message: `Expense with the ID ${id} was not found!` });
  }
});

app.listen(port, (): void => {
  console.log(`app started at localhost${port}`);
});