## Naïve deobfuscation approach : JObfuscator 

### update 15/08/2021 : see bottom of the page 🙂

End of July a new thread on tuts4you poped : [JObfuscator](https://forum.tuts4you.com/topic/43151-jobfuscator-java-source-code-obfuscator/) by PELock dev.

As mentioned in this thread, the obfuscation targets the java programming language. This is a source code obfuscation service, which means it does not aim at protected compiled java classes, but instead raw source code. 
My original RE field is .NET Framework, and Im mainly interested in obfuscated compiled binary, so I can play with it at the [MSIL](https://en.wikipedia.org/wiki/MSIL) level. This is the first time I find the motivation to try to deobfuscate obfuscated source code directly, and since there is a good chance all that it does is play with string manipulation, I wanted to make myself a challenge and resolve *JObfuscator* using the same technique it uses.

### General overview

On the [thread](https://forum.tuts4you.com/topic/43151-jobfuscator-java-source-code-obfuscator/) th owner decided to share obfuscated output with what seems to be the max settings, great we don't have to pay anything to access this SaaS service's output ! (<sup><sub>To contrast : on the official website you actually need to pay or own a valid activation code to see the result</sub></sup>)

Here is a piece of code from the output the dev posted on the thread:

```java
public static double Cvrhllagj(double[] numArray) {
	int[] var_3478 = { 8, 3, 14, 17, 4, 0, 21, 12, 10, 22, 13, 5, 11, 6, 20, 2, 1, 19, 9, 7, 16, 18, 15 };
	int[] var_48 = { 15, 14, 8, 10, 19, 9, 3, 1, 6, 7, 21, 22, 0, 17, 5, 2, 4, 18, 13, 11, 20, 16, 12 };
	double[] WOTZCG = { 18.084093774146382, 11.481328000776687, 6.25767347865484, 7.9123426219950845, 4.423024271079128, 17.066259411344387, 15.521405505078203, 9.404663834991512, 16.225767231726685, 10.246642407262673, 8.254399371827038, 20.491064601349656, 3.0904055727866364, 19.467555820208982, 21.282737133509713, 14.061857988465798, 5.769176313837545, 1.6379081253850827, 0.7228267888668826, 13.083662253507905, 2.0358874681756434, 22.11041950956832, 12.493462426129476 };
	int[] Ppg4Z_o7Iq_S6S3Pc2n_7DD = { 15, 0, 17, 20, 13, 16, 4, 21, 12, 18, 11, 5, 22, 19, 7, 8, 6, 1, 14, 10, 9, 3, 2 };
	int[] WAfQ60_6WCw7XySqS_ = { 5, 19, 7, 15, 18, 11, 14, 2, 12, 8, 6, 21, 13, 0, 10, 1, 22, 17, 4, 9, 3, 20, 16 };
	double[] QDDBGNAX_YGXFAGVX = { 5.6433629001113745, 15.616810068331857, 11.551395066461364, 4.727731358570409, 17.675970943440255, 14.51312442659091, 12.663994038040064, 2.79797018231503, 18.989438577105265, 13.839651313540829, 16.63293616530254, 10.568614676433752, 3.470988603923196, 1.1429810579011037, 22.717093553604883, 9.852141133725922, 21.904724814633237, 7.116487699653353, 0.8088045425922157, 20.016280203167902, 8.898229306321904, 19.445423346188882, 6.189662624316919 };
	double[] qA9Wf_wWZ4_B_XS4p = { 1.290103987E9, 1.69491033784547E9, 6.24417, 2.5791758908104E8, 1.00512972310615E9, 1.2930318626904E8, 0.70829, 0.0458, 2.0, 1.82539389E8, 2.98644, 1550.8451, 0.04581, 12.8323, 1.38371285524053E9, 9.4651327007304E8, 3.90196108E8, 5.35286808E8, 1.0713096137809E9, 1.0150643740104E8, 3.07761409854E7, 0.0, 257.50012 };
	int qQ3afFIA__VZ15a_fC = (int) (Math.sin(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[21]]])]]])]) + -qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[14]]])]]])]);
	int var_335 = (int) (Math.sinh(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[8]]])]]])]) + -qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[15]]])]]])]);
	double NVXTYU_EGSTGZZO = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])], fJjboumsjkNqkhjcnfHcftk = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];
	double YTZLE_VQWKAZWMFE = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];
	qQ3afFIA__VZ15a_fC = (int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[2]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[16]]])]]])]);
	while (qQ3afFIA__VZ15a_fC != (int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[18]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[11]]])]]])])) {
		switch(qQ3afFIA__VZ15a_fC) {
			case 2120820969:
				for (double ZHSHCP_SEQGYOJPY : numArray) {
					NVXTYU_EGSTGZZO += ZHSHCP_SEQGYOJPY;
				}
				qQ3afFIA__VZ15a_fC = (int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[17]]])]]])] - Math.sqrt(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[9]]])]]])]));
				break;
			case 1174681806:
				var_335 = numArray.length;
				qQ3afFIA__VZ15a_fC -= -(int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[3]]])]]])] - Math.expm1(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[4]]])]]])]));
				break;
			case 145090700:
				qQ3afFIA__VZ15a_fC -= -(int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[7]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[20]]])]]])]);
				break;
			case 1839443726:
				for (double g_aFsefwlpm : numArray) {
					fJjboumsjkNqkhjcnfHcftk += Math.pow(g_aFsefwlpm - YTZLE_VQWKAZWMFE, (int) Math.min(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[5]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[13]]])]]])]));
				}
				qQ3afFIA__VZ15a_fC ^= (int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[1]]])]]])] + Math.sin(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[19]]])]]])]));
				break;
			case 182539389:
				fJjboumsjkNqkhjcnfHcftk = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];
				qQ3afFIA__VZ15a_fC ^= (int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[0]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[22]]])]]])]);
				break;
			case 1071277910:
				YTZLE_VQWKAZWMFE = NVXTYU_EGSTGZZO / var_335;
				qQ3afFIA__VZ15a_fC ^= (int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[10]]])]]])] + Math.cos(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[6]]])]]])]));
				break;
		}
	}
	return Math.sqrt(fJjboumsjkNqkhjcnfHcftk / var_335);
}
```

In comparison, here is the original version the website preprint as default value : 

```java
public static double calculateSD(double numArray[])
{
	double sum = 0.0, standardDeviation = 0.0;
	int length = numArray.length;

	for(double num : numArray) {
		sum += num;
	}

	double mean = sum/length;

	for(double num: numArray) {
		standardDeviation += Math.pow(num - mean, 2);
	}

	return Math.sqrt(standardDeviation/length);
}
```


So what do we have here ? I can distinguish 2 things:

```markdown
- Numerical obfuscation
- Code flow manipulation
```

**update 15/02/2021 :** apparently i did not see the *string encryption* feature because I was working with a sample that did not have that.
I updated the blog post to cover that *string encryption* part !

# Numerical obfuscation

## Array obfuscation

The first thing to notice is the existence of arrays at the very top of the method, that seems to contains raw numerical values. What JObfuscator does is that it gather all double and integer values from the original code to newly created arrays and access the value using the value index in the array.

```java
/*A block of code containing all array that contains current method double and int values*/
int[] var_3478 = { 8, 3, 14, 17, 4, 0, 21, 12, 10, 22, 13, 5, 11, 6, 20, 2, 1, 19, 9, 7, 16, 18, 15 };
int[] var_48 = { 15, 14, 8, 10, 19, 9, 3, 1, 6, 7, 21, 22, 0, 17, 5, 2, 4, 18, 13, 11, 20, 16, 12 };
double[] WOTZCG = { 18.084093774146382, 11.481328000776687, 6.25767347865484, 7.9123426219950845, 4.423024271079128, 17.066259411344387, 15.521405505078203, 9.404663834991512, 16.225767231726685, 10.246642407262673, 8.254399371827038, 20.491064601349656, 3.0904055727866364, 19.467555820208982, 21.282737133509713, 14.061857988465798, 5.769176313837545, 1.6379081253850827, 0.7228267888668826, 13.083662253507905, 2.0358874681756434, 22.11041950956832, 12.493462426129476 };
int[] Ppg4Z_o7Iq_S6S3Pc2n_7DD = { 15, 0, 17, 20, 13, 16, 4, 21, 12, 18, 11, 5, 22, 19, 7, 8, 6, 1, 14, 10, 9, 3, 2 };
int[] WAfQ60_6WCw7XySqS_ = { 5, 19, 7, 15, 18, 11, 14, 2, 12, 8, 6, 21, 13, 0, 10, 1, 22, 17, 4, 9, 3, 20, 16 };
double[] QDDBGNAX_YGXFAGVX = { 5.6433629001113745, 15.616810068331857, 11.551395066461364, 4.727731358570409, 17.675970943440255, 14.51312442659091, 12.663994038040064, 2.79797018231503, 18.989438577105265, 13.839651313540829, 16.63293616530254, 10.568614676433752, 3.470988603923196, 1.1429810579011037, 22.717093553604883, 9.852141133725922, 21.904724814633237, 7.116487699653353, 0.8088045425922157, 20.016280203167902, 8.898229306321904, 19.445423346188882, 6.189662624316919 };
double[] qA9Wf_wWZ4_B_XS4p = { 1.290103987E9, 1.69491033784547E9, 6.24417, 2.5791758908104E8, 1.00512972310615E9, 1.2930318626904E8, 0.70829, 0.0458, 2.0, 1.82539389E8, 2.98644, 1550.8451, 0.04581, 12.8323, 1.38371285524053E9, 9.4651327007304E8, 3.90196108E8, 5.35286808E8, 1.0713096137809E9, 1.0150643740104E8, 3.07761409854E7, 0.0, 257.50012 };
```

These arrays values are never changed, so it will be easy to replace it as you will see. 

We can apply this string manipulation model : `qA9Wf_wWZ4_B_XS4p[17] = 535286808`


## Math.* namespace

This trick is well-known in the RE scene : transform numerical value to their correspondence using `Math.%insert_function_name%` functions. Hre is an exemple : 

```java
qQ3afFIA__VZ15a_fC -= -(int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[7]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[20]]])]]])]);
```

once the *Array obfuscation* removed, the actual function's argument are in clear, as you can see in this exerpt : 

```java
qQ3afFIA__VZ15a_fC -= -(int)390196108;
```

We can apply this string manipulation model : `Math.max(535286808, 101506437,40104) = 535286808`


## Math expressions

The obfuscated code also contains maths expressions such as 

```java
int var_335 = (int) (257,499827209547 + -257,50012);
```

~~I was too lazy to whole a whole Math emulator so I did what lazy people do : use online free APIs ! ~~

~~Let me present you [mathjs.org](https://api.mathjs.org) ! We simply need to send a request to their api using the expression grabbed from the obfuscated source code and it sends back the result ! Here is my sloppy code :  ~~

**update 15/08/2021 :** So the owner of JObfuscator taunted me because the online API I was previously using is capped at 10k requests/day so I had to come up with something internal AND unlimited.

Since Java and Csharp are very similar from a syntax pov, I decided we could dynamicly generate expressions using [CodeDom](https://www.c-sharpcorner.com/article/dynamically-creating-applications-using-system-codedom/) which is super sloppy BUT it works. I could directly use Roslyn compiler instead, I let you improve the code ;)

```csharp
public int EvaluateExpression(string expression) {
	if (!expression.EndsWith(";")) {
	    expression += ";";
	}
	
	string code = $@"
	public class A { {
	     public static string B() { {
		{expression}

		return {variableName};
	    } }
	} }
       ";

	var results = Compile(code);

	if (results.Errors.Count > 0)
	    throw new Exception("Error during expression evaluation");

	var methodInfo = results.CompiledAssembly.GetTypes().Single(
	    t => t.GetMethods().Count() > 0
	    && t.GetMethods().Count(m => m.ReturnParameter.ParameterType == typeof(int)) > 0
	    && t.GetMethods().Count(m => m.Name == "B") > 0)
	    .GetMethods()[0];

	var mResult = (int)methodInfo.Invoke(null, null);

	return mResult;
}
```

And guess what, I use this method too to decode the string encryption !

# Code flow obfuscation

Right after the block of code that contains the arrays that hold the double and integer values, we have the code flow manipulation code. 
Let's check the code flow obfuscated code (comments are not present in the obfuscated code of course) : 

```java

/*The code flow switch index */
int qQ3afFIA__VZ15a_fC = (int) (Math.sin(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[21]]])]]])]) + -qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[14]]])]]])]);

/*Loca variables used in the original method*/
int var_335 = (int) (Math.sinh(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[8]]])]]])]) + -qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[15]]])]]])]);
double NVXTYU_EGSTGZZO = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])], fJjboumsjkNqkhjcnfHcftk = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];
double YTZLE_VQWKAZWMFE = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];

/*Initialization of the code flow switch index value*/
qQ3afFIA__VZ15a_fC = (int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[2]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[16]]])]]])]);
while (qQ3afFIA__VZ15a_fC != (int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[18]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[11]]])]]])])) {
  switch(qQ3afFIA__VZ15a_fC) {

    /*actual blocks of code from the original method*/
    case 2120820969:
      for (double ZHSHCP_SEQGYOJPY : numArray) {
        NVXTYU_EGSTGZZO += ZHSHCP_SEQGYOJPY;
      }
      /*code to update the code flow switch index value to execute next block*/
      qQ3afFIA__VZ15a_fC = (int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[17]]])]]])] - Math.sqrt(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[9]]])]]])]));
      break;
    case 1174681806:
      var_335 = numArray.length;
      qQ3afFIA__VZ15a_fC -= -(int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[3]]])]]])] - Math.expm1(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[4]]])]]])]));
      break;
    case 145090700:
      qQ3afFIA__VZ15a_fC -= -(int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[7]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[20]]])]]])]);
      break;
    case 1839443726:
      for (double g_aFsefwlpm : numArray) {
        fJjboumsjkNqkhjcnfHcftk += Math.pow(g_aFsefwlpm - YTZLE_VQWKAZWMFE, (int) Math.min(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[5]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[13]]])]]])]));
      }
      qQ3afFIA__VZ15a_fC ^= (int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[1]]])]]])] + Math.sin(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[19]]])]]])]));
      break;
    case 182539389:
      fJjboumsjkNqkhjcnfHcftk = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];
      qQ3afFIA__VZ15a_fC ^= (int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[0]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[22]]])]]])]);
      break;
    case 1071277910:
      YTZLE_VQWKAZWMFE = NVXTYU_EGSTGZZO / var_335;
      qQ3afFIA__VZ15a_fC ^= (int) (qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[10]]])]]])] + Math.cos(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[6]]])]]])]));
      break;
  }
}
```

## Data initialization

The first step JObfuscator does is to declare a new winteger variable that will be used to keep track of the Control Flow correct routine.

```java
/*The code flow switch index */
int qQ3afFIA__VZ15a_fC = (int) (Math.sin(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[21]]])]]])]) + -qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[14]]])]]])]);
```

This code always sets the variable value to 0. This is to prevent compilation warnings and erros about potentiel undeclared variables! 

The real value is set few lines after : 

```java
/*Initialization of the code flow switch index value*/
qQ3afFIA__VZ15a_fC = (int) Math.max(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[2]]])]]])], qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[16]]])]]])]);
```

Once the `Math.*` obfuscated removed we can see its real value : 

```java
qQ3afFIA__VZ15a_fC = (int)182539389;
```


### Variable reinitialization

Then JObfuscator extracted all the integer/double variables present in the original code and declare them outside of the scope of the switch after in the code.

```java

/*Loca variables used in the original method*/
int var_335 = (int) (Math.sinh(qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[8]]])]]])]) + -qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[15]]])]]])]);
double NVXTYU_EGSTGZZO = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])], fJjboumsjkNqkhjcnfHcftk = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];
double YTZLE_VQWKAZWMFE = qA9Wf_wWZ4_B_XS4p[(int) (QDDBGNAX_YGXFAGVX[WAfQ60_6WCw7XySqS_[Ppg4Z_o7Iq_S6S3Pc2n_7DD[(int) (WOTZCG[var_48[var_3478[12]]])]]])];

```

Once deobfuscated their original values appear again : 

```java
int var_335 = (int) (257,499827209547 + -257,50012);
double NVXTYU_EGSTGZZO = 0, fJjboumsjkNqkhjcnfHcftk = 0;
double YTZLE_VQWKAZWMFE = 0;
```

## Code Flow 

The last step of the obfuscation is the actual split of the original code blocks into explicit blocks, here is a brief explanations using pseudo code:

Here you can imagine a function that has some code in it :

```
function start
  double value = 2.0
  double result = Math.Sin(2.98644)
  if value > result
    Print"Hocus"
  end if
  if value < result
    Print"Pocus"
  end if
function end
```

From the method code we can infer it has some "parts" we can cut out :

```
function start
  //1
  double value = 2.0
  double result = Math.Sin(2.98644)
  //
  
  //2
  if value > result
    Print"Hocus"
  end if
  //
  
  //3
  if value < result
    Print"Pocus"
  end if
  //
  
function end
```

The goal of the code flow obfuscation is to reorder the blocks in the method code, and to keep the original code flow. To achieve this it uses an *index* to know which code to execute next. I put the original code surrounded by the code flow code to make it easier to distinguish what is happening : 

```markdown


function start

  //index initialization
  int index = 0;
  
  //loop to keep the flow executing the code
  while 1=1
      // enter the current index block 
      switch index
        case 0:
            //1
# double value = 2.0
# double result = Math.Sin(2.98644)
            index = 1
            //
        case 1:
            //2
# if value > result
#   Print"Hocus"
# end if
            index = 2;
            //
        case 2:
            //3
# if value < result
#   Print"Pocus"
# end if
            // since we are inside the last block we know no code will be executed after so lets exit the function
            exit
            //
      end switch
   end while
function end

```
This is a simplified version, usually the correct indexes does not follow the order blocks are put in the method.
The only issue so far is that switch index are not left with raw values, they are encoded. Thanksfully we already decoded all these `Math.*` stuff, here is a block :

```java
case 182539389:
  fJjboumsjkNqkhjcnfHcftk = 0;
  qQ3afFIA__VZ15a_fC ^= (int)1290103987;
break;
```

What we need to do is to actually perform these operations, so we can determine the switch inde value, so we can know the next block to be executed, so we can extract its code and repeat till the end ... !

Here is more of my sloppy code : 

```csharp
var op = GetStringInBetween(SwitchIndexName, "(int)", current, false, false).Trim();
var param = int.Parse(GetStringInBetween("(int)", ";", current, false, false));

if (param == SwitchFinalIndex)
    return;

switch (op) {
    case "=":
        indexvalue = param;
        goto label_001;
    case "= -":
        indexvalue = -param;
        goto label_001;
    case "-=":
        indexvalue -= param;
        goto label_001;
    case "-= -":
        indexvalue -= -param;
        goto label_001;
    case "+=":
        indexvalue += param;
        goto label_001;
    case "+= -":
        indexvalue += -param;
        goto label_001;
    case "^=":
        indexvalue ^= param;
        goto label_001;
    case "^= -":
        indexvalue ^= -param;
        goto label_001;
}
```

And it works like a charm.


## String Encryption

**update from 15/08/2021**

So this is a part I missed last time. But ho lord what I shouldn't have done, JObfuscator owner again shown to everyone how good of a human he is.

The string encrytpion routine is apparently based on another of JObfuscator project, "string encrypt", a "polymorphic string encryption engine" which you also need to pay to use, marvelous.

This is how string encryption looks like once we removed all other nasty obfuscation phases :

```java
String var_3187 = ";
int[] W4_ZH_Lfcjn_XSCXp6g = { 0x5355, 0x52D1, 0x531D, 0x52E9, 0x5311, 0x531D, 0x52D9, 0x5311, 0x5421, 0x5391, 0x530D, 0x52C9, 0x52FD, 0x531D, 0x52D1, 0x52FD, 0x52E5, 0x52E9, 0x5421, 0x53AD, 0x5421, 0x540D, 0x53E9, 0x53C9, 0x5309 };
for (int var_1429 = 0, oaxYKroM5iU_KE_IxG8_ = 0; var_1429 < 25; var_1429++) {
	oaxYKroM5iU_KE_IxG8_ = W4_ZH_Lfcjn_XSCXp6g[var_1429];
	oaxYKroM5iU_KE_IxG8_++;
	oaxYKroM5iU_KE_IxG8_ ^= 65535;
	oaxYKroM5iU_KE_IxG8_ += 21667;
	oaxYKroM5iU_KE_IxG8_ = (((oaxYKroM5iU_KE_IxG8_ & 65535) >> 2) | (oaxYKroM5iU_KE_IxG8_ << 14)) & 65535;
	var_3187 += (char) (oaxYKroM5iU_KE_IxG8_ & 65535);
}
System.out.format(var_3187, var_3878);
```

I could have coded a complex parser or analyser here but guess what, I am *still* lazy so as mentioned before I just need to grab that whole block of code and pass it in my expression evaluator, in one call I can deobfuscate any of his current string encryption routine, even with like 10k mutation stages in it.

Here is the deobfuscated string : 

```java
String var_3187 = "Standard Deviation = %.6f";
```


## End notes

**update 15/08/2021**

JObfuscator dev wrote me :

```markdown
Just big lol at your reversing skills. If ppl like you write deobfscators I can sleep well.
[...]
Will you be honest and transparent with your readers and update your blog entry to tell about non-existent string deobfuscation in your deobfuscator?
```

Well here is it : I am sorry I did not see the string encryption routine before guys, but now there it is. And we can clearly see tha JObfuscator owner is a despicable person, this is too bad. But meh.



For the full deobfuscation code (**C#**) [check here](https://gist.github.com/XenocodeRCE/8a19f9926e1f99a7028d5cc7f4c2aa1c).

I also posted the output as comment so you can see whats going on.


In  the [thread](https://forum.tuts4you.com/topic/43151-jobfuscator-java-source-code-obfuscator/) on tuts4you there has been some bad atmosphere. Somebody said to JObfuscator dev 

```markdown
Another point I want to add to is, discrediting free or open source java obfuscators just because they are offered for free. This argument seems kinda naive and arrogant. Not to discredit your work but there are projects out there right now which have way more and more advanced features than your current state project. I see no point in you attacking other work without showing any benefits of your project or how your project is more secure than these solutions you discourage people to use. An example for what I would consider a good free and open source obfuscator is ProGuard. And with your current state I dont see how using your paid service would benefit me over that tool, but feel free to enlighten me.
```

to what the dev replied in an immature way :

```markdown
Man, cry me a f¤¤¤¤¤¤ river about your precious open source java obfuscators!
They are worthless.
Get yourself JEB 4 and see yourself how they cope with their shitty obfuscations.
**Your free or open source obfuscators are worth as much as you pay for it - 0 USD**
Gonna cry and rage even more? Let me get my popcorn and soda! 🍿🍹
```

I do not know about the other open source obfuscators out there, but I am now sure that if I can do it, everyone can do it too, so JObfuscator at current stage is pretty useless.




👋👋👋
XenocodeRCE - 13/08/2021
