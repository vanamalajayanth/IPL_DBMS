### **Guide for Populating and Querying IPL Data in PostgreSQL**

This assignment will guide you through designing a database schema, converting JSON data into a format suitable for database insertion, populating the database, and writing queries to extract meaningful insights. The focus is on breaking the problem down into manageable steps and solving it iteratively.

---

### **1. Break the problem down and solve it iteratively**

Rather than attempting to design and populate the entire database at once, follow a structured approach:

- Start by designing a minimal schema.
- Populate and test a small subset of the data.
- Expand the schema and add more data incrementally.
- Write queries to ensure correctness before scaling up.

---

### **2. Design the schema for match metadata first**

Before handling complex data like individual plays or statistics, start by designing the schema for match metadata. Think about what fundamental details a match must contain and how they should be stored.

---

### **3. Write a script to populate a single match**

Once the match metadata schema is designed, write a script that extracts match details from the JSON file and inserts them into the database. This step ensures that data is being correctly structured before scaling up.

---

### **4. Convert JSON to CSV for easier database insertion**

Since the data is provided in JSON format, writing direct SQL `INSERT` statements for complex structures can be difficult. Instead, convert JSON to CSV and use PostgreSQL’s `COPY` command for bulk insertion.

#### **Example: Converting JSON to CSV using Deno (sync version)**

```ts
import { writeFileSync } from 'deno/fs/mod.ts';

// Sample JSON data
const jsonData = [
  { id: 1, team1: 'Team A', team2: 'Team B', venue: 'Stadium X' },
  { id: 2, team1: 'Team C', team2: 'Team D', venue: 'Stadium Y' },
];

// Convert JSON to CSV
const csvData = ['id,team1,team2,venue'];
for (const match of jsonData) {
  csvData.push(`${match.id},${match.team1},${match.team2},${match.venue}`);
}

// Write to a file
b
```

This script reads JSON data, formats it into CSV, and saves it to a file. You can then use PostgreSQL’s `COPY` command to load this data efficiently.

---

### **5. Extend the schema to support more aspects of the game**

Once match metadata is successfully stored, think about additional details needed to fully capture the data. Consider:

- What other aspects of a match need to be tracked?
- How do they relate to each other?
- What constraints should be in place to maintain consistency?

Design your schema expansion carefully before proceeding.

---

### **6. Populate a single match with the extended schema**

Modify your script to extract and insert additional data for a single match. Ensure that the relationships between different pieces of data are correctly maintained.

---

### **7. Populate 10 matches and validate queries**

Once you successfully insert a single match with complete data, scale up to 10 matches. Then, write queries to:

- Retrieve match details
- Analyze player and team performance
- Extract key statistics

This step ensures that your schema and data handling are robust before working with the full dataset.

---

### **8. Use subqueries to handle foreign key references**

When inserting data into tables that have foreign key dependencies, direct insertion might not always be possible. Use subqueries to fetch the appropriate IDs before inserting dependent records.

#### **Example: Inserting data using a subquery to resolve foreign keys**

```sql
INSERT INTO SomeTable (column1, foreign_key_column)
VALUES ('Some Value', (SELECT id FROM OtherTable WHERE condition = 'Some Condition'));
```

This method ensures that foreign key constraints are maintained even if exact IDs are not known beforehand.

---

### **9. Scale up to all matches**

Once your schema and scripts are tested with 10 matches, expand to processing the full dataset. This will be the final large-scale test of your implementation.

---

### **10. Test your queries and submit**

Run all required queries against the full dataset to verify correctness. Ensure that your database design supports efficient querying before submitting your work.

---
