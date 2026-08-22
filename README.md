**my-cli-expense-tracker**  
# **ТЗ: CLI Expense Tracker на TypeScript**  
## **1. Цель**  
Создать консольное приложение для учёта личных расходов.  
Приложение должно позволять добавлять, удалять и просматривать расходы, а также получать статистику по категориям.  
Данные хранятся локально в JSON-файле.  
## **2. Стек**  
- TypeScript  
- Node.js  
- CLI  
- JSON для хранения данных  
- без базы данных  
- без UI  
Дополнительно можно использовать библиотеку для парсинга CLI-аргументов.  
## **3. Сущность Expense**  
Каждый расход должен содержать:  
- id — уникальный идентификатор  
- amount — сумма  
- category — категория  
- description — описание  
- createdAt — дата создания  
Категории:  
- food  
- transport  
- entertainment  
- shopping  
- health  
- other  
## **4. Команды**  
### **Добавление расхода**  
expense add --amount 12.50 --category food --description "Lunch"  
   
После добавления вывести созданный расход и его id.  
### **Получение списка**  
expense list  
   
Дополнительные фильтры:  
expense list --category food  
expense list --from 2026-08-01 --to 2026-08-31  
   
### **Удаление**  
expense delete --id 5  
   
Если расхода с таким ID нет — вывести понятную ошибку.  
### **Статистика**  
expense stats  
   
Пример:  
Total: 1250.40€  
   
food: 430.20€  
transport: 120.00€  
shopping: 350.20€  
other: 350.00€  
   
### **Статистика по категории**  
expense stats --category food  
   
## **5. Хранение данных**  
Использовать файл:  
data/expenses.json  
   
Пример:  
[  
  {  
    "id": 1,  
    "amount": 12.5,  
    "category": "food",  
    "description": "Lunch",  
    "createdAt": "2026-08-22T12:30:00.000Z"  
  }  
]  
   
Создание файла должно происходить автоматически, если он отсутствует.  
## **6. Архитектура**  
Не складывать всё в index.ts.  
Предполагаемая структура:  
src/  
  index.ts  
  cli/  
    commands.ts  
  domain/  
    expense.ts  
  services/  
    expense-service.ts  
    statistics-service.ts  
  repositories/  
    expense-repository.ts  
    file-expense-repository.ts  
  utils/  
    validation.ts  
    errors.ts  
   
data/  
  expenses.json  
   
## **7. TypeScript-требования**  
Проект должен быть написан с максимально строгой типизацией.  
Включить:  
{  
  "compilerOptions": {  
    "strict": true  
  }  
}  
   
Обязательно использовать:  
### **Union type**  
Например:  
type ExpenseCategory =  
  | "food"  
  | "transport"  
  | "entertainment"  
  | "shopping"  
  | "health"  
  | "other";  
   
### **Utility types**  
Использовать как минимум несколько из:  
- Pick  
- Omit  
- Partial  
- Record  
- Readonly  
Например, отдельно определить тип для создания расхода и для полного объекта расхода.  
### **Generic**  
Создать хотя бы один переиспользуемый generic.  
Например:  
interface Repository<T> {  
  findAll(): Promise<T[]>;  
  findById(id: number): Promise<T | undefined>;  
  create(entity: T): Promise<T>;  
  delete(id: number): Promise<void>;  
}  
   
### **Type guard**  
Например, для безопасной проверки данных, полученных из JSON:  
function isExpense(value: unknown): value is Expense {  
  // validation  
}  
   
Не использовать бездумно:  
const data = JSON.parse(file) as Expense[];  
   
Нужно считать данные из JSON недоверенными и валидировать их.  
## **8. Обработка ошибок**  
Приложение не должно падать с бессмысленным stack trace при неправильном вводе.  
Обработать:  
- отрицательную сумму  
- amount = 0  
- неизвестную категорию  
- отсутствие description  
- несуществующий id  
- неправильную дату  
- повреждённый JSON  
- отсутствие файла  
Ошибки желательно представить отдельными классами:  
class ValidationError extends Error {}  
   
class ExpenseNotFoundError extends Error {}  
   
class StorageError extends Error {}  
   
## **9. Критерии готовности**  
Проект считается законченным, если можно выполнить:  
expense add ...  
expense list  
expense list --category food  
expense list --from ... --to ...  
expense delete --id ...  
expense stats  
expense stats --category ...  
   
и все операции работают после перезапуска приложения.  
Дополнительно:  
- npm run build не выдаёт ошибок TypeScript  
- npm run lint не выдаёт ошибок  
- данные сохраняются между запусками  
- некорректный пользовательский ввод обрабатывается  
- нет any без веской причины  
## **10. Stretch goals**  
Если основная версия готова раньше времени:  
1. Добавить expense edit --id.  
2. Добавить месячные отчёты.  
3. Добавить сортировку.  
4. Добавить экспорт в CSV.  
5. Добавить импорт расходов из JSON.  
6. Написать unit-тесты для ExpenseService.  
7. Добавить dependency injection для repository.  
8. Сделать две реализации repository:  
  - JSON  
  - in-memory  
9. Добавить Result<T, E> вместо части исключений.  
10. Добавить pagination для list.  
## **11. Главное ограничение**  
Не пытаться сделать production-ready приложение.  
Цель проекта — **закрепить TypeScript**, поэтому при выборе между новой фичей и более качественной типизацией приоритет отдавать TypeScript.  
   
