<?php
require_once ($_SERVER['DOCUMENT_ROOT']."/gl/include/bd_1.php");



//$sql = "SELECT * FROM payment WHERE buy = :token LIMIT 1";
$sql = "SELECT * FROM payment WHERE buy = 1";
$r = $db->prepare($sql);
//$r->bindValue(':token', $token, PDO::PARAM_STR);
$r->execute();
$res = $r->fetchAll(PDO::FETCH_ASSOC);

$mess = count($res);


$data = array();
$i = 0;

foreach ($res as $text) 
{
	$data[$i]['id'] = json_decode($text['id']);
	
	if($text['date'])
	{
		$dateMonth = date_parse($text['date']);
		$data[$i]['date'] = $dateMonth['month'].'.'.$dateMonth['year'];	
	}

	if($text['amount'])
	{
		$data[$i]['amount'] = json_decode($text['amount']);	
	}	
	
	$i++;
}

$data = json_encode( $data );

?>


<div nameId="aut">
	<div style="width: 150px; margin: 20px 20px 20px auto;">
        <div style="display: flex; justify-content: center; align-items: center; margin: 10px;">
          <input type="text" value="" nameId="inputValue" style="width: 300px; height: 25px; margin-right: 10px; border: 1px solid #D1D1D1; outline: none;">
        </div>		
	</div>
</div>




<style type="text/css">
body
{
	width: 95%;
	height: 90%;

	font-family: arial,sans-serif;
	font-size: 18px;
	color: #666;	
}

.block_1
{
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	
	display: flex;
	flex-direction: column;
	
	width: 950px;			
	
	border: 1px solid #b3b3b3; 
	border-radius: 3px;

	background-image: -moz-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); 
	background-image: -webkit-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); 
	background-image: -o-linear-gradient(top, #ffffff 0%, #e3e3e3 100%); 
	background-image: -ms-linear-gradient(top, #ffffff 0% ,#e3e3e3 100%); 
	background-image: linear-gradient(top, #ffffff 0% ,#e3e3e3 100%);    
	box-shadow:0px 0px 2px #bababa, inset 0px 0px 1px #ffffff;
}


.inf_text
{
	
}

.css_canvas
{
	display: flex; 
	align-items: center; /* Выравнивание текста по вертикали */
	justify-content: center; /* Выравнивание текста по горизонтали */	
	width: 100%;
	height: 80%;
	border: 1px solid #b3b3b3;
	box-sizing: border-box;
	background: #fff;
}

</style>


<div nameId="wrap" class="block_1">
	<canvas nameId="graph" class="css_canvas"></canvas>
	<div style="height: 550px; margin: 20px;">
		<div style="display: flex; margin-top: 20px;">
			<div style="">Кол-во успешных записей:</div>
			<div style="margin-left: 20px;"><?=$mess?></div>
		</div>
		
		<div style="display: flex; margin-top: 20px;">
			<div style="">Результат:</div>
			<div nameId="valueSum" style="margin-left: 20px;"><?=$mess?></div>
		</div>

		<div nameId="contentList" style="display: flex; margin-top: 20px;"></div>			
	</div>
</div>



<script>
// рисуем график
class MyGraphPaint
{
	wrap;
	canvas;
	ratio;
	
	constructor()
	{
		this.init();		
	}
	
	init()
	{
		this.wrap = document.querySelector('[nameId="wrap"]');
		this.canvas = this.wrap.querySelector('[nameId="graph"]');
		
		// устанавливаем разрешение
		const bound = this.canvas.getBoundingClientRect();
		this.canvas.width = bound.width * 2;	
		this.canvas.height = bound.height * 2;
		
		this.ratio = this.canvas.width/this.canvas.height;
		this.ratio /= 1.5;
		
		console.log(999, this.ratio);
		
		//this.draw();
	}
	
	draw({data})
	{
		const arrSum = data.map((item)=> item.sum);
		const arrCount = data.map((item)=> item.count);
		
		const yMaxSum = Math.max(...arrSum);
		const yMaxCount = Math.max(...arrCount);
		
		const yRatioSum = this.canvas.height / yMaxSum;
		const yRatioCount = this.canvas.height / yMaxCount;
		
		const canvas = this.canvas;
		const context = this.canvas.getContext('2d');
		
		if(1===2)
		{
			context.beginPath();
			
			context.font = '100px Arial';
			context.fillStyle = 'rgba(0, 0, 0, 1)';
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillText('заголовок', canvas.width / 2, canvas.height / 20 );

			
			context.arc(canvas.width/2, canvas.height/2, canvas.height/2, 0, 2*Math.PI, false);
			context.fillStyle = 'rgba(255,255,255,0)';
			context.fill();
			context.lineWidth = 1;
			context.strokeStyle = 'rgba(0, 0, 0, 1)';

			context.stroke();
			context.closePath();			
		}
		
		
		this.drawAxisX({context, yMaxSum, yMaxCount});
		this.drawAxisY({context, value: 200 + 200 * 5 + 20});
		
		this.drawGraph({context, yRatio: yRatioCount, arr: arrCount, offsetX: 0, color: 'rgba(77, 127, 255, 1)'});
		this.drawGraph({context, yRatio: yRatioSum, arr: arrSum, offsetX: 20, color: 'rgba(255, 77, 77, 1)'});
	}
	
	
	// рисуем Axis
	drawAxisX({context, yMaxSum, yMaxCount})
	{
		context.beginPath();
		context.strokeStyle = 'rgba(77, 127, 255, 0.6)';
		context.font = '20px Arial';
		
		
		const count = 10;
		const step = this.canvas.height / this.ratio / count;
		const textStep1 = yMaxSum / count;
		const textStep2 = yMaxCount / count;
		
		context.fillStyle = 'rgba(255, 77, 77, 1)';
		
		for ( let i = 0; i <= count; i++ )
		{
			const y = step * i;
			const text = textStep1 * i;
			console.log(this.canvas.height, y);
			context.moveTo(0, this.canvas.height - y);
			context.lineTo(this.canvas.width, this.canvas.height - y);
			
			context.fillText(text, 0, this.canvas.height - y - 5 );
		}

		context.fillStyle = 'rgba(77, 127, 255, 1)';
		
		for ( let i = 0; i <= count; i++ )
		{
			const y = step * i;
			const text = textStep2 * i;
			
			context.fillText(Math.round(text), 0, this.canvas.height - y + 20 );
		}
		
		context.stroke();
		context.closePath();		
	}


	drawAxisY({context, value})
	{
		context.beginPath();
		context.strokeStyle = 'rgba(255, 0, 0, 1)';
		
		context.moveTo(value, 0);
		context.lineTo(value, this.canvas.height);
		
		context.stroke();
		context.closePath();		
	}
	

	drawGraph({context, yRatio, arr, offsetX, color})
	{
		context.beginPath();		
		let x = 200;		
		for(const y of arr)
		{
			context.fillStyle = color;
			context.fillRect(x + offsetX, this.canvas.height - y / this.ratio * yRatio, 20, y / this.ratio * yRatio);
			x += 200;
		}
		context.stroke();
		context.closePath();		
	}
}


// парсим данные с бд и правильно упаковываем в json
class MyInitCalc
{
	data = [];
	sum = 0;
	
	
	init({year})
	{
		const data = JSON.parse('<?=$data?>');
		console.log(data);

		this.calcData({data, year});
		
		this.calcSum();
	}

	calcData({data, year})
	{
		const list = [];

		for ( let i = 0; i < data.length; i++ )
		{
			const month = data[i].date;
			
			if(!month.includes(year)) continue;	// поиск по году
			
			const index = list.findIndex((o) => o.month === month);
			
			if (index === -1) 
			{
				list.push({ month, count: 1, sum: data[i].amount, amount: [{sum: data[i].amount, count: 1}] });
			}
			else
			{
				list[index].count += 1;
				list[index].sum += data[i].amount;
				
				const index2 = list[index].amount.findIndex((o) => o.sum === data[i].amount);
				
				if (index2 === -1)
				{
					list[index].amount.push({sum: data[i].amount, count: 1});
				}
				else
				{
					list[index].amount[index2].count += 1;
				}
			}
		}

		console.log(list);
		
		this.data = list;
	}
	
	calcSum()
	{
		this.sum = 0;
		
		for ( let i = 0; i < this.data.length; i++ )
		{
			this.sum += this.data[i].sum;
		}

		console.log(this.sum);		
	}

	getData()
	{
		return this.data;
	}
	
	getSum()
	{
		return this.sum;
	}
	
}


</script>

<script>
const inputValue = document.querySelector('[nameId="inputValue"]');


inputValue.onkeydown = (e) => 
{
	if (e.code === 'Enter') 
	{
		const year = inputValue.value;
		
		const divValueSum = document.querySelector('[nameId="valueSum"]');
		const divContentList = document.querySelector('[nameId="contentList"]');

		const myInitCalc = new MyInitCalc();
		const myGraphPaint = new MyGraphPaint();

		myInitCalc.init({year});
		const jsonData = myInitCalc.getData();
		const fullSum = myInitCalc.getSum();

		myGraphPaint.draw({data: jsonData});


		divValueSum.innerText = fullSum;

		divContentList.innerHTML = '';
		let html = '';
		for(let i = 0; i < jsonData.length; i++)
		{
			html += '<div style="display: flex;">';
			html += '<div style="margin: 5px 45px 5px 0;">pos: ' + jsonData[i].month + '</div>';
			html += '<div style="margin: 5px 45px;">count: ' + jsonData[i].count + '</div>';
			html += '<div style="margin: 5px 45px;">sum: ' + jsonData[i].sum + '</div>';
			html += '</div>';
		}
		divContentList.innerHTML = '<div style="display: flex; flex-direction: column;">'+html+'</div>';
		console.log(divContentList);

	}
};
</script>

								
								
								