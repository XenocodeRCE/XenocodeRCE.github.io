# Naïve obfuscation approach :'JConfuse', a JObfuscator clone

Hello everyone 👋 in my last blog entry I shared with you a PoC making JObfuscator deobfuscation easy. 
As expected, the owner refused to admit any flaws in his product / SaaS and made false assumptions about the deobfuscation routines I shared with you.

But I do not want to waste my time that much, what I wanted was to disprove his own remarks considering that his SaaS services 
is worth more than all public and open-source java obfuscators out there. Apparently it can still be deobfuscated, even by skids like me.

But he still refused to understand, so what to do ? Make a java source code obfuscator that does at least what JObfuscator does ! 😉

*note : I will not handle Renaming obfuscation, this blog post serves as a PoC exactly like the last one*


# The features


### Extract every double value from the methods and store them in an array

This is my original code : 

```java
public static double method(double param) {
  double a = 1.1;
  double b = a + 2.2;
  double c = 0.0;
  if (b > 3.3) return c;

  return 4.4;
}
 ```
 
 - I need to greab all *double* values in the code (1.1, 2.2 etc.)
 - For each grabbed value, insert it in a new double[] array
 - Replace the double value in the code with a call to that array including correct index


 ```csharp
private static void StoreLocalValuesInArrays() {
  /*Double pass*/
  int index = 0;
  var name = RandomString(5);
  string tmpArray = $"double[] {name} = {{ ";

  for (int i = 0; i < obedCode.Length; i++) {
      var currentLine = obedCode[i].Replace(";", " ").Replace("(", " ").Replace(")", " ").Replace("{", " ").Replace("}", " ");
      var words = currentLine.Split(' ');
      foreach (var word in words) {
          if (IsDouble(word)) {
              tmpArray += word + ",";
              obedCode[i] = obedCode[i].Replace(word, $"{name}[{index}]");
              index++;
          }
      }
  }
  if(index != 0) {
      tmpArray = tmpArray.Remove(tmpArray.Length - 1) + " };";
      List<string> tmp = obedCode.ToList();
      tmp.Insert(0, tmpArray);
      obedCode = tmp.ToArray();
  }
}
 ```
 
 And here is our result : 
 
 ```java
 double[] J45JRP = { 1.0,2.2,0.0,3.3,4.4 };

  double a = J45JRP[0];
  double b = a + J45JRP[1];
  double c = J45JRP[2];
  if (b > J45JRP[3]){
    return c;
  }
  return J45JRP[4];
 ```
 
 Looks pretty similar, except JObfuscator shuffle the double[] content order, which adds literally 0 difficulty to the deobfuscation process, so lets skip it 👍


### Encrypt strings using randomly generated polymorphic encryption algorithms

This is again really easy to mimick his obfuscation routine. A string is a char array, which is also an integer array where integer values cannot be more than 255.

Here is a sample of obfuscated code : 

```java
String var_127 = "";
int[] var_1774 = { 0xFB5F, 0xF9EF, 0xF89F, 0xF9EF,
                   0xFDFF, 0xFB0F, 0xF9DF, 0xF99F,
                   0xF8AF, 0xF8CF, 0xF9CF, 0xF9EF,
                   0xF8BF, 0xF90F, 0xF8DF, 0xFDFF,
                   0xFB0F, 0xF91F, 0xF93F, 0xF96F,
                   0xF91F, 0xF9AF };
for (int hGrz = 0, x = 0; hGrz < 22; hGrz++) {
  x = var_1774[hGrz];
  x ^= 0xFFFF;
  x = ((x << 12) | ((x & 0xFFFF) >> 4)) & 0xFFFF;
  var_127 += (char) (x & 0xFFFF);
}

```

Here is how I understand it :

- each encoding pass can be reverted
- each char of the string is encoded using a reversible algorithm

Reversible ? Here is what I mean :

```csharp
int a = 123;
a ^= 0x16BF; // prints 5828
a ^= 0x16BF; // prints 123

a -= 0xE869; //prints -59374
a += 0xE869; //prints 123

a = ((a << 3) | ( (a & 0xFFFF) >> 13)) & 0xFFFF; //prints 984
a = ((a >> 3) | ( (a & 0xFFFF) << 13)) & 0xFFFF; //prints 123

a++; //prints 124
a--; //prints 123
```

So it means that while we will process each individual char, we will make both the encryption and the decryption routine at the same time !

For the conveniance of this little blog post I only kept 2 mutation types, but if you understand the idea you can add as many as you want !

I use my code evaluator from the last time in order to check the content of both input and output.

```csharp
private static void ObfuscateStrings() {

    for (int i = 0; i < obedCode.Length; i++) {
        var current = obedCode[i];
        if (!current.Contains("\"")) continue;
        string str = GetStringInBetween("\"", "\"", current, false, false);

        string string_name = $"str_{RandomString(3)}";
        string array_name = $"array_{RandomString(4)}";


        List<string> encodingPass = new List<string>();
        List<string> decodingPass = new List<string>();
        int numberofPass = random.Next(5, 10);
        int tmpval;
        for (int x = 0; x < numberofPass; x++) {
            switch (random.Next(0, 2)) {
                case 0:
                    tmpval = random.Next(2, 10);
                    encodingPass.Add($"{array_name}[currentChar] -= {tmpval};" + Environment.NewLine);
                    decodingPass.Add($"{array_name}[currentChar] += {tmpval};" + Environment.NewLine);
                    break;
                case 1:
                    tmpval = random.Next(2, 10);
                    encodingPass.Add($"{array_name}[currentChar] += {tmpval};" + Environment.NewLine);
                    decodingPass.Add($"{array_name}[currentChar] -= {tmpval};" + Environment.NewLine);
                    break;
            }
        }
        encodingPass.Add($"{string_name} += (char){array_name}[currentChar];");
        decodingPass.Add($"{string_name} += (char){array_name}[currentChar];");

        string intarray = $"int[] {array_name} = {{ ";
        foreach (var item in str) {
            intarray += (int)item + ",";
        }
        intarray = intarray.Remove(intarray.Length - 1);
        intarray += " };";


        string pass = $@"
            string {string_name} = """";
            {intarray}
            for (int currentChar = 0; currentChar < {array_name}.Length; currentChar++) {{
                {string.Join(Environment.NewLine, encodingPass.ToArray())}
            }}
        ";
        char[] r1 = eval.EvaluateString(pass, string_name);


        string charsStr = new string(r1);
        intarray = $"int[] {array_name} = {{ ";
        foreach (var item in charsStr) {
            intarray += (int)item + ",";
        }
        intarray = intarray.Remove(intarray.Length - 1);
        intarray += " };";

        pass = $@"
            string {string_name} = """";
            {intarray}
            for (int currentChar = 0; currentChar < {array_name}.Length; currentChar++) {{
                {string.Join(Environment.NewLine, decodingPass.ToArray())}
            }}
        ";


        char[] r2 = eval.EvaluateString(pass, string_name);
        string toverif = new string(r2);
        if (toverif != str)
            throw new Exception("intput and output does not matches !");


        Console.WriteLine(pass);
    }
}
```

And here is our results : 

```java
String str_J01E = "";
int array_JGG57[] = { 71,94,115,94,29,76,95,99,114,112,96,94,113,108,111,29,76,107,105,102,107,98 };
for (int currentChar = 0; currentChar < array_JGG57.Length; currentChar++) {
    array_JGG57[currentChar] += 3;
    array_JGG57[currentChar] += 5;
    array_JGG57[currentChar] -= 7;
    array_JGG57[currentChar] -= 2;
    array_JGG57[currentChar] += 4;
    str_J01E += (char)array_JGG57[currentChar];
}
```

Again, pretty similar to what JObfuscator can offer !



### Encrypt integer values using floating point math functions

Here is the original code we are supposed to obfuscate :

```java
public static int method(int param) {
  int a = 1;
  int b = a + 2;
  int c = 0;
  if (b > 3) return c;

  return 4;
}
```

Our goal will be to 
- Grab all integers
- Mutate them using the `Math.*` namespace

The way we will do this is using the lazy way : using my evaluator !

Let's first generate random maths expressions that uses the `Math.*` namespace, then evaluate it to get its results, and substract the difference to our original value.

(shoutout to @Charterino for helping me here with the logic of the expression)

```csharp
private static void ObfuscateIntegers() {
  for (int i = 0; i < obedCode.Length; i++) {
      var currentLine = obedCode[i];
      var words = currentLine.Split(' ');
      for (int i2 = 0; i2 < words.Length; i2++) {

          if (words[i2].Contains(")") || words[i2].Contains(";")) {
              var tmp = words[i2].Replace(")", "").Replace(";", "");
              if (IsInt(tmp)) {

                  int originalValue = int.Parse(tmp);
                  //we now have our separated integer
                  //lets randomly build an expression

                  int PassNumber = random.Next(2, 3);

                  string[] mathOperations = new string[] {
                      $"System.Math.Abs(1.0)",
                      $"System.Math.Acos(1.0)",
                      $"System.Math.Asin(1.0)",
                      $"System.Math.Atan(1.0)",
                      $"System.Math.Atan2(1.0 , 2.0)",
                      $"System.Math.Cos(1.0)",
                      $"System.Math.Cosh(1.0)",
                      $"System.Math.Exp(1.0)",
                      $"System.Math.IEEERemainder(1.0 , 2.0)",
                      $"System.Math.Log(1.0)",
                      $"System.Math.Log10(1.0)",
                      $"System.Math.Max(1.0 , 2.0)",
                      $"System.Math.Min(1.0 , 2.0)",
                      $"System.Math.Pow(1.0 , 2.0)",
                      $"System.Math.Round(1.0)",
                      $"System.Math.Sign(1.0)",
                      $"System.Math.Sinh(1.0)",
                      $"System.Math.Sqrt(1.0)",
                      $"System.Math.Tan(1.0)",
                      $"System.Math.Tanh(1.0)"
                  };

                  for (int mOps = 0; mOps < mathOperations.Length; mOps++) {
                      mathOperations[mOps] = mathOperations[mOps].Replace("1.0", GetRandomNumber(1.0, 2.0).ToString().Replace(",", "."));
                      mathOperations[mOps] = mathOperations[mOps].Replace("2.0", GetRandomNumber(1.0, 2.0).ToString().Replace(",", "."));

                  }
                  string[] mathOperators = new string[] { 
                      "+",
                      "-",
                      "*"
                  };
                  string expression = "(int) (";
                  for (int p = 0; p < PassNumber; p++) {
                      expression += mathOperations[random.Next(mathOperations.Length - 1)];
                      if(p != PassNumber-1) {
                          expression += " " + mathOperators[random.Next(mathOperators.Length - 1)] + " ";
                      }
                  }
                  expression += ")";
                  int expressionResult = eval.EvaluateExpression(expression); //-2147483648

                  int x = (originalValue - expressionResult) * -1;
                  expression += $" - {x}";

                  obedCode[i] = obedCode[i].Replace(tmp, expression);
              }
          }

      }
  }
}
```


Here is the result we have :


```java
public static int method(int param) {
  int a = (int) (System.Math.IEEERemainder(1.4286774706229 , 1.12153017526564) + System.Math.Pow(1.61358974436931 , 1.90637074918783)) - 1;
  int b = a + (int) (System.Math.Exp(1.70829766276679) + System.Math.Tan(1.83236189411597)) - -1;
  int c = (int) (System.Math.Exp(1.29537231535435) + System.Math.Cosh(1.83431815767396)) - 6;
  if (b > (int) (System.Math.Round(1.79511685054522) + System.Math.Log(1.35533657733134)) - -1) return c;

  return (int) (System.Math.Asin(1.62305007857413) + System.Math.IEEERemainder(1.58524886266573 , 1.64057746605974)) - 2147483644;
}
```

Looks pretty similar too ! JObfuscator result : 

```java
public static int method(int param) {
  int a = (int) (681.57415 - Math.cbrt(315229127.95597));
  int b = a + (int) (2.76739 - Math.acos(0.71973));
  int c = (int) (-1.20690 + Math.tan(0.87887));
  if (b > (int) (-1.85887 + Math.log10(72255.55488)))
    return c;
  return (int) Math.min(6525.74776, 4.00000);
}
```


This is 11pm now, tomorrow i will cover the `Change linear code execution flow to nonlinear version` and then we will be done 
