//JSON object must contain

// "question": "Has anyone ever been so far even as to decided to what to do look more like?",
// "answer": 10,
// "playerAnswer": 60,
// "availableAnswers": d3.range(1,101),
// "allGuesses": [38,23,34,57,84,24,39,93,73,87,11,63,92,57,24,34,47,11,49,86,88,17,97,85,99,75,92,99,94,21,71,24,88,92,5,67,18,44,13,86,38,47,88,3,45,17,72,29,55,36,20,51,73,35,61,98,90,73,22,96,92,89,17,7,39,97,9,5,80,14,65,41,63,81,6,76,60,61,90,73,3,58,68,52,31,25,21,55,42,83,49,58,21,27,16,24,64,56,48,90]

function FormatNumber(number,magnitude)
{
	if (magnitude == "percentage")
	{
		return parseInt(number)+"%"
	}
	else if (number < 1000)
	{
		return number
	}
	else if (number < 1000000)
	{
		return parseInt(number/100)/10 + " Thousand"
	}
	else if (number < 1000000000)
	{
		return parseInt(number/100000)/10 + " Million"
	}
	else
	{
		return parseInt(number/100000000)/10 + " Trillion"
	}
}

function CalculatePlayersBeaten(valueinlist,playervalueinlist,allGuesses)
{
 		var diff = Math.abs(playervalueinlist - valueinlist)
 		var lower = valueinlist - diff
 		var upper = valueinlist + diff

 		if (lower < 0)
 		{
 			lower = 0
 		}

 		if (upper > allGuesses.length-1)
 		{
 			upper = allGuesses.length-1
 		}

 		playersBeaten = 0
 		playersBeatenBy = 0
 		for (i in allGuesses)
 		{
 			if (parseInt(i) < lower || parseInt(i) > upper)
 			{
 				playersBeaten = playersBeaten + allGuesses[i];
 			}
 			else
 			{
 				playersBeatenBy = playersBeatenBy + allGuesses[i];
 			}
 		}

 		playersPercentile = playersBeaten/(playersBeaten+playersBeatenBy)

 		return [playersBeaten,playersBeatenBy,playersPercentile]
}

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
	jsondata = jsonobject;
	var question = jsondata.question;
	var answer = jsondata.answer;
	var playerAnswer = jsondata.playerAnswer;
	var availableAnswers = jsondata.availableAnswers;
	var allGuesses = jsondata.allGuesses;
	var magnitude = jsondata.magnitude;

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
	var widthfromleft = width*0.05

	var chartx = d3.scale.ordinal()
	 	.rangePoints([0,width*0.8])

	var startingchartx = d3.scale.ordinal()
	 	.rangePoints([0,width*0.8])

	var charty = d3.scale.linear()
	 	.range([0,chartheight])

	chartx.domain(availableAnswers)	
	startingchartx.domain([0,1,2,3,4])

	charty.domain([d3.max(allGuesses),0])

	//Append the question to the chart object

	chart.append("rect")
    	.attr("y",screeny(3.6))
    	.attr("x",screenx(10))
    	.attr("width",0)
    	.attr("height",screeny(0.6))
    	.style("opacity",0.5)
    	.style("fill","#D7A865")
    	.style("stroke","white")
    	.style("stroke-width","1px")
    	.transition().duration(1000)
    	.attr("width",width)
    	.attr("x",screenx(0))


	var d3question = chart.append("text")
	.attr('y',screeny(4))
	.attr("x",function(d)
    	{
    		return screenx(5)
    	})
    .attr("text-anchor", "middle") 
    .attr("id","middleQuestion")
	.style("font-family", "sans-serif")
    .style("font-size", "30px")
    .style("fill", "white")
    .text(question)
    .style('opacity',0)
    .transition().delay(1000).duration(1000)
    .style("opacity",1);





    function tickerquestion(textObject)
    {
    	var bbox = d3.selectAll("#middleQuestion").node().getBBox()
    	boxwidth = bbox.width
    	textObject.attr("x",width+boxwidth/2)
    	.style("opacity",1)
    	.attr("text-anchor", "right")
    	.transition().duration(10000).ease("linear")
    	.attr("x",-boxwidth/2)

    	setTimeout(function(){tickerquestion(textObject)},10000)
    }
    //SCROLLING Question Info:
    var bbox = d3.selectAll("#middleQuestion").node().getBBox()
    if (bbox.width >= 0.8*width)
    {
    	tickerquestion(d3.selectAll("#middleQuestion"))
    }
    
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
 	.attr('width',width*0.808)

 	//Show correct Answer
	var correctanswerbox = chart.append("rect")
    .attr("x",widthfromleft+chartx(answer))
    .attr("y",screeny(-2))
    .attr('width',width*0.8/100)
    .attr('height',screeny(1))
    .style('fill',"green")
    .style("stroke", "black")
 	.style("stroke-width", "1px")
 	.transition().delay(1000).duration(1000)
 	.attr("y",screeny(1))

 	chart.append('text')
 		.attr("x",widthfromleft+chartx(answer))
    	.attr("y",screeny(-2))
    	.attr("class","chartText")
    	.style("fill","green")
    	.text(FormatNumber(answer,magnitude))
    	.transition().delay(1000).duration(1000)
    	.attr("y",screeny(2.7))

   	//ShowPlayerAnswer
	var playeranswerbox = chart.append("rect")
    .attr("x",widthfromleft+chartx(playerAnswer))
    .attr("y",screeny(-2))
    .attr('width',width*0.8/100)
    .attr('height',screeny(1))
    .style('fill',"blue")
    .style("stroke", "black")
 	.style("stroke-width", "1px")
 	.transition().delay(1000).duration(1000)
 	.attr("y",screeny(1))

 	//ShowPlayerScore

 	chart.append('text')
 		.attr("x",widthfromleft+chartx(playerAnswer))
    	.attr("y",screeny(-2))
    	.attr("class","chartText")
    	.style("fill","blue")
    	.text(FormatNumber(playerAnswer,magnitude))
    	.transition().delay(1000).duration(1000)
    	.attr("y",screeny(2.4));

 	valueinlist = availableAnswers.indexOf(answer)
 	playervalueinlist = availableAnswers.indexOf(playerAnswer)


 	var difference = playerAnswer-answer
 	scorevals = CalculatePlayersBeaten(valueinlist,playervalueinlist,allGuesses)

 	pointsearned = scorevals[0];

 	var scoreDisplay = chart.append("text")
 	.attr('x',screenx(3.8))
 	.attr("y",screeny(0.5))
 	.attr("class","chartText")
 	.style("fill","white")
 	.text("Your Score (Number of players that you Beat):")

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
 	
 	//Actually add the points earned to the score/
    setTimeout(function(){score = score+pointsearned;},1000)

    //Add difference from final score
    chart.append('text')
 		.attr("x",function()
 			{
 				//Estimate where the answer sits.
 				valueinlist = availableAnswers.indexOf(answer)
 				playervalueinlist = availableAnswers.indexOf(playerAnswer)

 				lengthoflist = availableAnswers.length

				if (answer == playerAnswer)
				{
					if (valueinlist/lengthoflist > 0.7 || valueinlist/lengthoflist < 0.3)
					{
						return chartx(availableAnswers[parseInt(lengthoflist*0.5)])+widthfromleft
					}
					else
					{
						return chartx(availableAnswers[parseInt(lengthoflist*0.7)])+widthfromleft
					}
				}  	

				if (Math.max(valueinlist,playervalueinlist)/lengthoflist<0.5 )
				{
					return chartx(availableAnswers[parseInt(lengthoflist*0.7)])+widthfromleft
				}

				else if (Math.min(valueinlist,playervalueinlist)/lengthoflist>0.5 )
				{
					return chartx(availableAnswers[parseInt(lengthoflist*0.3)])+widthfromleft
				}

				else
				{
					return chartx(availableAnswers[parseInt(lengthoflist*0.5)])+widthfromleft
				}

 			})
    	.attr("y",screeny(1.6))
    	.attr("class","chartText")
    	.attr("text-anchor", "right") 
    	.style("fill",function()
    		{
    			if (answer != playerAnswer)
    			{
    				return "red"
    			}
    			else
    			{
    				return "green"
    			}
    		})
    	.style('stroke',"black")
    	.style("stroke-width","1px")
    	.style("font-size","30px")
    	.style('opacity',0)
    	.text(function()
    		{
    			if (answer > playerAnswer)
    			{
    				return "You were under by: " + FormatNumber(Math.abs(difference),magnitude)
    			}
    			else if (answer < playerAnswer)
    			{
    				return "You were over by: " + FormatNumber(Math.abs(difference),magnitude)
    			}
    			else
    			{
    				return "You Are Correct!"
    			}
    		})
    	.transition().duration(1000).delay(2000)
    	.style('opacity',1);

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

				resultsactive = false

				chart.attr("width",0).attr("height",0)
			})

 	 //Create x-Axis

 	//Bottom Chart Axis
	var tenx  = []
	for (i in d3.range(1,availableAnswers.length,1))
	{

		if (i%interval==0)
			{
				tenx.push(x[i])
			}
	}

	if (x[x.length-1] in tenx == false)
	{
		tenx.push(availableAnswers[availableAnswers.length-1]) 
	}

 	var xAxis = d3.svg.axis()
    .scale(chartx)
    .orient("bottom")
    .ticks(10,",.1s")
    .tickValues(tenx)
	.tickFormat(d3.format(",.1s"))

    //Tooltip object
	var tip = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function(d) {
	  	for (i in d) {key = i}
	    return "<strong>Number of People who Selected Answer "+availableAnswers[key]+":</strong> <span style='color:red'>" + d[key]+ "</span>";
	  })

	 chart.call(tip);
 	 //Create Bar Chart

 	 var diff = Math.abs(playervalueinlist - valueinlist)
 		var lower = valueinlist - diff
 		var upper = valueinlist + diff

 		if (lower < 0)
 		{
 			lower = 0
 		}

 		if (upper > allGuesses.length-1)
 		{
 			upper = allGuesses.length-1
 		}


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
 	      		return parseInt(chartheight)+parseInt(heightfromtop); 
 	      	})
 	      .attr("height", function(d) 
 	      	{
 	      		for (i in d) {key = i};
 	      	 	return 0; 
 	      	})
 	      .attr("width", barWidth*0.8)
 	      .attr("startingPosition",function(d)
 	      	{
 	      		for (i in d) {key = i};
 	      		return BarTypes(answer,playerAnswer,parseInt(key),playerAnswerAboveAnswer)
 	      	})
 	      	.attr("class", "bar")
 	      	.style("stroke", "black")
 	      	.style("stroke-width", "1px")
 	      	.on("mouseover", tip.show)
 	      	.on("mouseout",tip.hide)
 	      	.transition().delay(3000).duration(1000)
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
 	      .style("fill", function(d)
   	      {
   	      	for (i in d) {key = i};
   	      	id = availableAnswers.indexOf(parseInt(key))
   	      	if (parseInt(id) < lower || parseInt(id) > upper)
   	      	{	
   	      		return "#4C668C"
   			}
   			else
   			{
   				return "#448F30"
   			}

 	      })



 	chart.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate("+(widthfromleft+(barWidth*0.8)/2)+"," + (parseInt(chartheight)+parseInt(heightfromtop))+")")
     .call(xAxis)
     .style("opacity",0)
     .transition().duration(1000).delay(3000)
     .style('opacity',1);

 	//Append the players Guess on the chart
 	chart.append("line")
 		.attr("x1",widthfromleft+chartx(playerAnswer)+(barWidth*0.8)/2)
 		.attr("x2",widthfromleft+chartx(playerAnswer)+(barWidth*0.8)/2)
 		.attr("y1",chartheight+heightfromtop)
 		.attr("y2",heightfromtop*0.9)
 		.attr('height',chartheight)
 		.attr("stroke-width",4)
 		.attr("stroke", "Blue")
 		.style("opacity",0)
 		.transition().duration(1000).delay(4000).style("opacity",1);


 	chart.append("text")
 		.attr("x",widthfromleft+chartx(playerAnswer)+(barWidth*0.8)/2)
 		.attr("y",heightfromtop*0.85)
 		.text("Your Answer")
 		.style("font-family", "sans-serif")
    	.style("font-size", "20px")
    	.style("fill", "blue")
    	.style("opacity",0)
 		.transition().duration(1000).delay(4000).style("opacity",1);


 	//Append the correct answer
 	chart.append("line")
 		.attr("x1",widthfromleft+chartx(answer)+(barWidth*0.8)/2)
 		.attr("x2",widthfromleft+chartx(answer)+(barWidth*0.8)/2)
 		.attr("y1",chartheight+heightfromtop)
 		.attr("y2",heightfromtop*0.9)
 		.attr('height',chartheight)
 		.attr("stroke-width",4)
 		.attr("stroke", "green")
 		.style("opacity",0)
 		.transition().duration(1000).delay(4000).style("opacity",1);;

 	chart.append("text")
 		.attr("x",widthfromleft+chartx(answer)+(barWidth*0.8)/2)
 		.attr("y",heightfromtop*0.80)
 		.text("Correct Answer")
 		.style("font-family", "sans-serif")
    	.style("font-size", "20px")
    	.style("fill", "green")
    	.style("opacity",0)
 		.transition().duration(1000).delay(4000).style("opacity",1);


 	chart.append("text")
 		.attr("x",screenx(2))
 		.attr("y",screeny(5))
 		.text("You did better than "+parseInt(scorevals[2]*1000)/10+"% of players")
 		.style("opacity",0)
 		.style("font-family", "sans-serif")
    	.style("font-size", "20px")
    	.style("fill", "#4C668C")
 		.transition().duration(1000).delay(4000).style("opacity",1)


 		//Generate Random Statistic

 	function AddRandomStat()
	{
	 	function ReturnPercentile(percentile)
	 	{
	 		var total = 0;
			$.each(allGuesses,function() {
	    		total += this;
			});

			medianvalue = parseInt(total*percentile)

			newtots = 0
			count = 0
			for (i in allGuesses)
			{
				newtots = newtots+allGuesses[i]
				if (newtots > medianvalue)
				{
					i = i-1

					break
				}
			}
			return availableAnswers[i]
	 	}

	 	statsavailable =
	 	[
	 		["The Average Player Answered: "+ReturnPercentile(0.5)],
	 		["10% of Players Answered: "+ReturnPercentile(0.9)+" or more"],
	 		["10% of Players Answered: "+ReturnPercentile(0.1)+" or less"],
	 		["80% of Players Answered: "+ReturnPercentile(0.2)+" or more"],
	 		["80% of Players Answered: "+ReturnPercentile(0.8)+" or less"]
	 	]


	 	chart.append('text')
	 		.attr('x',screenx(6))
	 		.attr('y',screeny(5))
	 		.text(statsavailable[parseInt(Math.random()*5)])
	 		.style("font-family", "sans-serif")
    		.style("font-size", "20px")
    		.style("fill", "orange")
    		.style("opacity",0)
    		.transition().delay(6000)
    		.style("opacity",1)

		}

		AddRandomStat()

	}