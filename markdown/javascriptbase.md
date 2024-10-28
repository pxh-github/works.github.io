## JavaScript基础
>#### 变量声明
>>
>>   JavaScript使用`var`、`let`或`const`关键字来声明变量。`var`声明的变量具有函数作用域或全局作用域，而`let`和`const`声明的变量具有块级作用域（即它们只在包含它们的块或任何子块中可用）。
>>
>>   ```javascript
>>   var x = 5; // 函数作用域或全局作用域
>>   let y = 10; // 块级作用域
>>   const z = 15; // 块级作用域，且值不可变
>>   ```
>>
>#### 数据类型
>>
>>   字符串（String）、数字（Number）、布尔值（Boolean）、空值（Null）、未定义（Undefined）、对象（Object）
>#### 操作符
>>
>>   算术操作符（+、-、*、/、%等）、赋值操作符（=、+=、-=等）、比较操作符（==、===、!=、!==等）和逻辑操作符（&&、||、!等）。
>>
>#### 条件语句
>>
>>   使用`if`、`else if`和`else`语句来执行基于条件的代码块。
>>
>>   ```javascript
>>   if (condition) {
>>     // 当condition为true时执行的代码
>>   } else if (anotherCondition) {
>>     // 当anotherCondition为true时执行的代码
>>   } else {
>>     // 当上述条件都不满足时执行的代码
>>   }
>>   ```
>>
>#### 循环
>>
>> ##### `for`循环、`while`循环和`do...while`循环。
>>   ```javascript
>>   for (let i = 0; i < 10; i++) {
>>     console.log(i);
>>   }
>>   let j = 0;
>>
>>   while (j < 10) {
>>     console.log(j);
>>     j++;
>>   }
>>   let k = 0;
>>
>>   do {
>>     console.log(k);
>>     k++;
>>   } while (k < 10);
>>   ```
## 函数
>JaaScript函数是一组可以执行特定任务的语句。你可以使用`function`关键字来定义函数，或者使用箭头函数（ES6引入）。
>>```
>>javascript
>>// 使用function关键字定义函数
>>function sayHello() {
>>  console.log("Hello, world!");
>>}
>>
>>// 使用箭头函数定义函数
>>const sayGoodbye = () => {
>>  console.log("Goodbye, world!");
>>};
>>```
## 对象和数组
>#### 对象
>>   对象是JavaScript中的基本数据类型之一，用于存储键值对。你可以使用对象字面量、构造函数或`Object.create()`方法来创建对象。
>>
>>   ```javascript
>>   const person = {
>>     name: "John",
>>     age: 30,
>>     greet: function() {
>>       console.log("Hello, " + this.name);
>>     }
>>   };
>>
>>   person.greet(); // 输出: Hello, John
>>   ```
>#### 数组
>>   数组是一种特殊的对象类型，用于存储有序的元素集合。你可以使用数组字面量或`Array`构造函数来创建数组。
>>
>>   ```javascript
>>   const fruits = ["Apple", "Banana", "Cherry"];
>>   const numbers = new Array(1, 2, 3, 4, 5);
>>   ```