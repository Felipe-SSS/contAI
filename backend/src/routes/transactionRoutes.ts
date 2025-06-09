import { Router } from "express";
import { Transaction } from "../entities/Transaction";
import { AppDataSource } from "../database/data-source";
import { validate } from "class-validator";
import dayjs from "dayjs";

const router = Router();
const transactionRepo = AppDataSource.getRepository(Transaction);

router.get("/", async (_req, res) => {
  const transactions = await transactionRepo.find();
  res.json(transactions);
});

router.delete("/all", async (_req, res) => {
  try {
    await transactionRepo.clear();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting all transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await transactionRepo.delete(id);

    if (result.affected === 0) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.status(204).send();
    return;
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
    return; 
  }
});


router.post("/", async (req, res) => {

    try {
        const transaction = Object.assign(new Transaction(), {
          ...req.body,
          date: req.body.date,
        });
        const errors = await validate(transaction);

        if(errors.length > 0){
            res.status(400).json({
                message: "Validation failed",
                errors,
            });
            return;
        }

        else{
            const saved = await transactionRepo.save(transaction);
            res.status(201).json(saved);
            return;
        }

    } catch (error){
        console.error("Error saving transaction:", error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }

});

router.get("/summary", async (_req, res) => {
  try {
    const transactions = await transactionRepo.find();

    const summaryMap = new Map<string, {
      transactions: Transaction[],
      totalCredit: number,
      totalDebit: number
    }>();

    for (const tx of transactions) {
      const monthKey = dayjs(tx.date).format("MM/YYYY");

      if (!summaryMap.has(monthKey)) {
        summaryMap.set(monthKey, {
          transactions: [],
          totalCredit: 0,
          totalDebit: 0
        });
      }

      const group = summaryMap.get(monthKey)!;
      group.transactions.push(tx);

      if (tx.type === "credit") {
        group.totalCredit += Number(tx.value);
      } else {
        group.totalDebit += Number(tx.value);
      }
    }

    const summary = Array.from(summaryMap.entries()).map(([month, data]) => ({
      month,
      ...data
    }));

    res.json(summary);
    return; 

  } catch (error) {
    console.error("Error generating summary:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await transactionRepo.findOneBy({ id: Number(id) });

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    const updatedData = {
      ...req.body,
      value: Number(req.body.value), // 🔁 garante que seja número
    };

    Object.assign(transaction, updatedData);

    const errors = await validate(transaction);
    if (errors.length > 0) {
      res.status(400).json({
        message: "Validation failed",
        errors,
      });
      return;
    }

    const updated = await transactionRepo.save(transaction);
    res.json(updated);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
});

export default router;