var headerContent = document.getElementById("header");
var footerContent = document.getElementById("footer");


headerContent.innerHTML = `
	<div class="blad">
		<h1>Betra Nám.is</h1>
	</div>
	<nav>
		<ul id="main_nav">
			<li><h2>Námskeiðin</h2>
				<ul>
					<li><a href="#">Lesblinda</a></li>
					<li><a href="#">Lesum hraðar </a></li>
					<li><a href="#">Reiknum hraðar</a></li>
					<li><a href="#">Ofurminni</a></li>
				</ul>
			</li>
			<li><h2>Námsörðuleikar</h2>
				<ul>
					<li><a href="#">Lesblinda</a></li>
					<li><a href="#">Skrifblinda</a></li>
					<li><a href="#">Reikniblinda</a></li>
					<li><a href="#">Mæla lestrarhraða</a></li>
					<li><a href="#">Fá ráðgjöf</a></li>
				</ul>
			</li>
			<li><h2>Um okkur</h2>
				<ul>
					<li><a href="#">Almennt um BetraNám.is </a></li>
					<li><a href="#">Skilmálar</a></li>
					<li><a href="#">Blogg / Fréttir</a></li>
					<li><a href="#"></a></li>
				</ul>
			</li>
			<li class="blog-link">
				<h2>Blogg</h2>
			</li>
		</ul>
	</nav>
`;

footerContent.innerHTML = `
	<div>
		GK Ráðgjöf ehf.<br>
		Kolbeinn Sigurjónsson<br>
		<email>kolbeinn@betranam.is</email>
	</div>
	<div>
		<address>
			Kjarni,<br>
			Þverholti 2, 5. hæð<br>
			270 Mosfellsbær<br>
			Sími <em>566 66 64</em> 
		</address>
	</div>
`
