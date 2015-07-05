//JSON object must contain

// "question": "Has anyone ever been so far even as to decided to what to do look more like?",
// "answer": 10,
// "playerAnswer": 60,
// "availableAnswers": d3.range(1,101),
// "allGuesses": [38,23,34,57,84,24,39,93,73,87,11,63,92,57,24,34,47,11,49,86,88,17,97,85,99,75,92,99,94,21,71,24,88,92,5,67,18,44,13,86,38,47,88,3,45,17,72,29,55,36,20,51,73,35,61,98,90,73,22,96,92,89,17,7,39,97,9,5,80,14,65,41,63,81,6,76,60,61,90,73,3,58,68,52,31,25,21,55,42,83,49,58,21,27,16,24,64,56,48,90]



function BarTypes(answer,playerAnswer,barValue, playerAnswerAboveAnswer)
{

	if (playerAnswer == answer)
	{
		if (barValue < answer)
		{
			return 0
		}
		else if (barValue > answer)
		{
			return 4
		}
		else
		{ 
			return 2
		}
	}
	if (playerAnswerAboveAnswer == true)
	{
		if (barValue == answer)
		{
			return 1
		}
		else if (barValue == playerAnswer)
		{
			return 3
		}
		else if (barValue > playerAnswer)
		{
			return 4
		}
		else if (barValue < answer)
		{
			return 0

		}
		else
		{
			return 2
		}
	}
	else
	{
		if (barValue == answer)
		{
			return 3
		}
		else if (barValue == playerAnswer)
		{
			return 1
		}
		else if (barValue > answer)
		{
			return 4
		}
		else if (barValue < playerAnswer)
		{
			return 0
		}
		else
		{
			return 2
		}
	}
}

function GetHeightOfBarTypes(answer,playerAnswer,availableAnswers,allGuesses,playerAnswerAboveAnswer)
{
	barsize = {0:0,1:0,2:0,3:0,4:0}
	for (i in availableAnswers)
	{
		type = BarTypes(answer,playerAnswer,availableAnswers[i],playerAnswerAboveAnswer)
		barsize[type] = barsize[type]+allGuesses[i]
	}
	return barsize
}

function GetWidthsOfBarTypes(answer,playerAnswer,availableAnswers,playerAnswerAboveAnswer)
{
	barsize = {0:0,1:0,2:0,3:0,4:0}
	for (i in availableAnswers)
	{
		type = BarTypes(answer,playerAnswer,availableAnswers[i],playerAnswerAboveAnswer)
		barsize[type] = barsize[type]+1
	}
	return barsize
}

function GetXOfBarTypes(answer,playerAnswer,availableAnswers,playerAnswerAboveAnswer)
{
	barsize = {}
	for (i in availableAnswers)
	{
		type = BarTypes(answer,playerAnswer,availableAnswers[i],playerAnswerAboveAnswer)
		if (!(type in barsize))
		{
			barsize[type] = availableAnswers[i]
		}
	}
	return barsize
}

function ShowResults(jsonobject)
{


	//var jsondata = json.parse(jsonobject);
	jsondata = jsonobject;
	var question = jsondata.question;
	var answer = jsondata.answer;
	var playerAnswer = jsondata.playerAnswer;
	var availableAnswers = jsondata.availableAnswers;
	var allGuesses = jsondata.allGuesses;

	var allGuessesSum = allGuesses.reduce(function(a, b){return a+b;});
	var allGuessesPercent = [];

	var playerAnswerAboveAnswer = false;
	if (playerAnswer > answer)
	{
		playerAnswerAboveAnswer = true;
	}

	for (i in allGuesses)
	{
		allGuessesPercent.push(allGuesses[i]/allGuessesSum)
	}

	var data= [];
	for (i in d3.range(allGuesses.length))
	{
		val = new Object();
		key = String(availableAnswers[i]);
		value = allGuesses[i];
		val[key] = value;
		data.push(val);
	}

	var width = window.innerWidth;
	    height = window.innerHeight;

	var chart = d3.select(".chart")
	    .attr("width", width*0.95)
	    .attr("height", height*0.95);

	//screen x/y will scale a value from 0-10 on screen.  Makes it easier to place text on the chart object.
	var screenx =  d3.scale.linear()
	 	.range([0,width])
	 	.domain([0,10]);

	var screeny = d3.scale.linear()
	    .range([0,height*1.0])
	    .domain([0,10]);

	//chartx is the function to place the values
	var chartheight = height*0.2
	var heightfromtop = height*0.7
	var widthfromleft = width*0.1

	var chartx = d3.scale.ordinal()
	 	.rangePoints([0,width*0.8])

	var startingchartx = d3.scale.ordinal()
	 	.rangePoints([0,width*0.8])

	var charty = d3.scale.linear()
	 	.range([0,chartheight])

	chartx.domain(availableAnswers)	
	startingchartx.domain([0,1,2,3,4])

	charty.domain([0, d3.max(allGuesses)])

	//Append the question to the chart object
	var d3question = chart.append("text")
	.attr('y',screeny(4))
	.attr("x",function(d)
    	{
    		return screenx(5)
    	})
    .attr("text-anchor", "middle") 
	.style("font-family", "sans-serif")
    .style("font-size", "30px")
    .style("fill", "white")

    .text(question);


 	 var barWidth = width / availableAnswers.length;
 	 var startingbarWidth = width / 5;


    //Create a rectangle to show the players answer vs the correct answer

    var answerbox = chart.append("rect")
    .attr("x",widthfromleft)
    .attr("y",screeny(1))
    .attr('width',0)
    .attr('height',screeny(1))
    .style("stroke", "white")
 	.style("stroke-width", "1px")
 	.transition().duration(1000)
 	.attr('width',width*0.8)

 	//Show correct Answer
	var correctanswerbox = chart.append("rect")
    .attr("x",widthfromleft+chartx(answer))
    .attr("y",screeny(-2))
    .attr('width',width/(availableAnswers.length))
    .attr('height',screeny(1))
    .style('fill',"green")
    .style("stroke", "black")
 	.style("stroke-width", "1px")
 	.transition().delay(1000).duration(1000)
 	.attr("y",screeny(1))

 	chart.append('text')
 		.attr("x",widthfromleft+chartx(answer)+barWidth/2)
    	.attr("y",screeny(-2))
    	.attr("class","chartText")
    	.style("fill","green")
    	.text(answer)
    	.transition().delay(1000).duration(1000)
    	.attr("y",screeny(2.4))

   	//ShowPlayerAnswer
	var playeranswerbox = chart.append("rect")
    .attr("x",widthfromleft+chartx(playerAnswer))
    .attr("y",screeny(-2))
    .attr('width',width/(availableAnswers.length))
    .attr('height',screeny(1))
    .style('fill',"blue")
    .style("stroke", "black")
 	.style("stroke-width", "1px")
 	.transition().delay(1000).duration(1000)
 	.attr("y",screeny(1))

 	//ShowPlayerScore
 	var difference = playerAnswer-answer

 	
 	pointsearned = 100-difference;

 	var scoreDisplay = chart.append("text")
 	.attr('x',screenx(4.5))
 	.attr("y",screeny(0.5))
 	.attr("class","chartText")
 	.style("fill","white")
 	.text("Your Current Score: ")


	var scoreDisplay = chart.append("text")
 	.attr('x',screenx(5.5))
 	.attr("y",screeny(0.5))
 	.attr("class","chartText")
 	.style("fill","white")
 	.text(score)
 	.transition().duration(1000).delay(1000)
 	.tween("text", function() {
		  var i = d3.interpolateRound(score, score+pointsearned);
		  return function(t) {
		    this.textContent = i(t);
		  };
	});
 	
    setTimeout(function(){score = score+pointsearned;},2000)

  	chart.append('text')
 		.attr("x",widthfromleft+chartx(playerAnswer)+barWidth/2)
    	.attr("y",screeny(-2))
    	.attr("class","chartText")
    	.style("fill","blue")
    	.text(playerAnswer)
    	.transition().delay(1000).duration(1000)
    	.attr("y",screeny(2.4))

    

  	chart.append('text')
 		.attr("x",function()
 			{
 				if (playerAnswerAboveAnswer == true)
 				{
 					return (chartx(playerAnswer)-chartx(answer))
 				}
 				else
 				{
 					return(chartx(answer)-chartx(playerAnswer))
 				}

 			})
    	.attr("y",screeny(1.6))
    	.attr("class","chartText")
    	.style("fill","red")
    	.style('stroke',"black")
    	.style("stroke-width","1px")
    	.style("font-size","30px")
    	.style('opacity',0)
    	.text(function()
    		{
    			if (answer != playerAnswer)
    			{
    				return "You were out by: " + difference
    			}
    			else
    			{
    				return "You Are Correct!"
    			}
    		})
    	.transition().duration(1000).delay(2000)
    	.style('opacity',1)



    //Add object to go to next question
    chart.append("svg:image")
	    .attr("x",screenx(8))
		.attr('y',screeny(4.5))
		.attr('width', screenx(1))
   		.attr('height', screeny(0.8))
		.attr("xlink:href","next.png")
		.on("click",function() 
			{
				listtoremove = d3.select("svg")[0][0].children
				i = listtoremove.length-1

				while (i>=0)
				{
					listtoremove[i].remove();
					i=i-1;
				}
				chart.attr("width",0).attr("height",0)
			})


 	 //Create x-Axis
 	 var xAxis = d3.svg.axis()
    .scale(chartx)
    .orient("bottom");

 	 

 	 //Get Starting Bar Size

 	 var startingHeights = GetHeightOfBarTypes(answer,playerAnswer,availableAnswers,allGuesses,playerAnswerAboveAnswer)

 	 maxSH = 0
 	 //findmaxstartingheights
 	 for (i in startingHeights)
 	 {
 	 	if (startingHeights[i] > maxSH)
 	 	{
 	 		maxSH = startingHeights[i]
 	 	}
 	 }

 	 for (i in startingHeights)
 	 {
 	 	
 	 	startingHeights[i]  =startingHeights[i] / maxSH * d3.max(allGuesses)
 	 }

 	 var startingWidths = GetWidthsOfBarTypes(answer,playerAnswer,availableAnswers,playerAnswerAboveAnswer)
	 var startingX = GetXOfBarTypes(answer,playerAnswer,availableAnswers,playerAnswerAboveAnswer)


 	 //Create Bar Chart
     chart.selectAll("g").data(data).enter().append("rect")

     //Final variables defined.  Will pull them and move there when they need to.
     	.attr("x",function(d)
     		{
     			for (i in d) {key = i};
     			return widthfromleft+chartx(key)
     		})
 	      .attr("y", function(d) 
 	      	{ 
 	      		for (i in d) {key = i};
 	      		return heightfromtop + charty(d[key]); 
 	      	})
 	      .attr("height", function(d) 
 	      	{
 	      		for (i in d) {key = i};
 	      	 	return chartheight - charty(d[key]); 
 	      	})
 	      .attr("width", barWidth - 5)
 	      .attr("startingPosition",function(d)
 	      	{
 	      		for (i in d) {key = i};
 	      		return BarTypes(answer,playerAnswer,parseInt(key),playerAnswerAboveAnswer)
 	      	})

	 	    // .attr("x",function(d)
 		    // {
 		    // 	var startingposition = this.getAttribute("startingPosition");
 		    // 	return widthfromleft + chartx(startingX[startingposition])
 	    	// })

 	    	//  .attr("y",function(d)
 		    // {
 		    // 	var startingposition = this.getAttribute("startingPosition")
 	     //  		return heightfromtop + startingHeights[startingposition]; 
 	    	// })

 	    	// .attr('width',function()
	    		// {
	    		// 	var startingposition = this.getAttribute("startingPosition")
	    		// 	return startingWidths[startingposition]*(barWidth-3);
	    		// })
 	    	// .attr('height',function()
 	    	// {
 	    	// 	var startingposition = this.getAttribute("startingPosition")
 	    	// 	return (chartheight - startingHeights[startingposition])
 	    	// })
 	      	.attr("class", "bar")
 	      	.style("stroke", "black")
 	      	.style("stroke-width", "1px")
 	      	// .transition().delay(1000).duration(1000)
 	      	
 	      	// .attr("height",function(){return this.getAttribute("finalheight")})
 	      	// .attr("width",function(){return this.getAttribute("finalwidth")})
 	      	// .attr("y",function(){return this.getAttribute("finaly")})
 	      	// .transition().delay(200000).duration(1000)
 	      	// .attr("x",function(){return this.getAttribute("finalx")});

 	chart.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate("+(widthfromleft+(barWidth - 5)/2)+"," + (parseInt(chartheight)+parseInt(heightfromtop))+")")
     .call(xAxis);

 	//Append the players Guess on the chart
 	chart.append("line")
 		.attr("x1",widthfromleft+chartx(playerAnswer)+(barWidth - 5)/2)
 		.attr("x2",widthfromleft+chartx(playerAnswer)+(barWidth - 5)/2)
 		.attr("y1",chartheight+heightfromtop)
 		.attr("y2",heightfromtop*0.9)
 		.attr('height',chartheight)
 		.attr("stroke-width",4)
 		.attr("stroke", "Blue");

 	chart.append("text")
 		.attr("x",widthfromleft+chartx(playerAnswer)+(barWidth - 5)/2)
 		.attr("y",heightfromtop*0.85)
 		.text("Your Answer")
 		.style("font-family", "sans-serif")
    	.style("font-size", "20px")
    	.style("fill", "blue")


 	//Append the correct answer
 	chart.append("line")
 		.attr("x1",widthfromleft+chartx(answer)+(barWidth - 5)/2)
 		.attr("x2",widthfromleft+chartx(answer)+(barWidth - 5)/2)
 		.attr("y1",chartheight+heightfromtop)
 		.attr("y2",heightfromtop*0.9)
 		.attr('height',chartheight)
 		.attr("stroke-width",4)
 		.attr("stroke", "green");

 	chart.append("text")
 		.attr("x",widthfromleft+chartx(answer)+(barWidth - 5)/2)
 		.attr("y",heightfromtop*0.85)
 		.text("Correct Answer")
 		.style("font-family", "sans-serif")
    	.style("font-size", "20px")
    	.style("fill", "green")
	}


// examplejson = 
// {
// "question": "Has anyone ever been so far even as to decided to what to do look more like?",
// "answer": 10,
// "playerAnswer": 60,
// "availableAnswers": d3.range(1,101),
// "allGuesses": [38,23,34,57,84,24,39,93,73,87,11,63,92,57,24,34,47,11,49,86,88,17,97,85,99,75,92,99,94,21,71,24,88,92,5,67,18,44,13,86,38,47,88,3,45,17,72,29,55,36,20,51,73,35,61,98,90,73,22,96,92,89,17,7,39,97,9,5,80,14,65,41,63,81,6,76,60,61,90,73,3,58,68,52,31,25,21,55,42,83,49,58,21,27,16,24,64,56,48,90]
// };

// jsonobject = examplejson;

// ShowResults(examplejson)

