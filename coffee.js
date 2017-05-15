/*
 * coffee.js
 * Copyright (C) 2016 root <root@vps-1077934-6587.manage.myhosting.com>
 *
 * Distributed under terms of the MIT license.
 */
NUM_PARTICLES = 150
NUM_BANDS = 128
SMOOTHING = 0.5
MP3_PATH = 'http://crossorigin.me/https://s3-us-west-2.amazonaws.com/s.cdpn.io/1715/the_xx_-_intro.mp3'

SCALE = MIN: 5.0,  MAX: 80.0
SPEED = MIN: 0.2,   MAX: 1.0
ALPHA = MIN: 0.8,   MAX: 0.9
SPIN  = MIN: 0.001, MAX: 0.005
SIZE  = MIN: 0.5,   MAX: 1.25

COLORS = [
  '#69D2E7'
    '#1B676B'
      '#BEF202'
        '#EBE54D'
	  '#00CDAC'
	    '#1693A5'
	      '#F9D423'
	        '#FF4E50'
		  '#E7204E'
		    '#0CCABA'
		      '#FF006F'
		      ]

# Audio Analyser

		      class AudioAnalyser
		        
		        @AudioContext: self.AudioContext or self.webkitAudioContext
			  @enabled: @AudioContext?
			    
			    constructor: ( @audio = new Audio(), @numBands = 256, @smoothing = 0.3 ) ->
			      
			        # construct audio object
			        if typeof @audio is 'string'
				      
				      src = @audio
				            @audio = new Audio()
	      @audio.crossOrigin = "anonymous"
	            @audio.controls = yes
		          @audio.src = src
			    
			      # setup audio context and nodes
			      @context = new AudioAnalyser.AudioContext()
	    
	    # createScriptProcessor so we can hook onto updates
	    @jsNode = @context.createScriptProcessor 2048, 1, 1
	        
	        # smoothed analyser with n bins for frequency-domain analysis
	        @analyser = @context.createAnalyser()
	    @analyser.smoothingTimeConstant = @smoothing
	        @analyser.fftSize = @numBands * 2
		    
		    # persistant bands array
		    @bands = new Uint8Array @analyser.frequencyBinCount

		        # circumvent http://crbug.com/112368
		        @audio.addEventListener 'canplay', =>
			    
			      # media source
			      @source = @context.createMediaElementSource @audio

			            # wire up nodes

			            @source.connect @analyser
				          @analyser.connect @jsNode

					        @jsNode.connect @context.destination
						      @source.connect @context.destination

						            # update each time the JavaScriptNode is called
						            @jsNode.onaudioprocess = =>

							            # retreive the data from the first channel
							            @analyser.getByteFrequencyData @bands
								            
								            # fire callback
								            @onUpdate? @bands if not @audio.paused
									            
									      start: ->
									        
									          @audio.play()
	    
	  stop: ->
	    
	      @audio.pause()
	    
# Particle

	class Particle
	  
	  constructor: ( @x = 0, @y = 0 ) ->

	      @reset()
	    
	  reset: ->
	    
	      @level = 1 + floor random 4
	          @scale = random SCALE.MIN, SCALE.MAX
		      @alpha = random ALPHA.MIN, ALPHA.MAX
		          @speed = random SPEED.MIN, SPEED.MAX
			      @color = random COLORS
			          @size = random SIZE.MIN, SIZE.MAX
				      @spin = random SPIN.MAX, SPIN.MAX
				          @band = floor random NUM_BANDS
					      
					      if random() < 0.5 then @spin = -@spin
					          
					          @smoothedScale = 0.0
						      @smoothedAlpha = 0.0
						          @decayScale = 0.0
							      @decayAlpha = 0.0
							          @rotation = random TWO_PI
								      @energy = 0.0
								          
								        move: ->
									  
									    @rotation += @spin
									        @y -= @speed * @level
										    
										  draw: ( ctx ) ->
										      
										      power = exp @energy
										          scale = @scale * power
											      alpha = @alpha * @energy * 1.5
											          
											          @decayScale = max @decayScale, scale
												      @decayAlpha = max @decayAlpha, alpha
												          
												          @smoothedScale += ( @decayScale - @smoothedScale ) * 0.3
													      @smoothedAlpha += ( @decayAlpha - @smoothedAlpha ) * 0.3
													          
													          @decayScale *= 0.985
														      @decayAlpha *= 0.975
														        
														          ctx.save()
	    ctx.beginPath()
	    ctx.translate @x + cos( @rotation * @speed ) * 250, @y
	        ctx.rotate @rotation
		    ctx.scale @smoothedScale * @level, @smoothedScale * @level
		        ctx.moveTo @size * 0.5, 0
			    ctx.lineTo @size * -0.5, 0
			        ctx.lineWidth = 1
				    ctx.lineCap = 'round'
				        ctx.globalAlpha = @smoothedAlpha / @level
					    ctx.strokeStyle = @color
					        ctx.stroke()
	    ctx.restore()
	    
# Sketch
	    
	Sketch.create

	  particles: []
	    
	    setup: ->
	        
	        # generate some particles
	        for i in [0..NUM_PARTICLES-1] by 1
		      
		      x = random @width
		            y = random @height * 2
			          
			          particle = new Particle x, y
				        particle.energy = random particle.band / 256
					      
					      @particles.push particle
					            
					          if AudioAnalyser.enabled
						        
						        try

							        # setup the audio analyser
							        analyser = new AudioAnalyser MP3_PATH, NUM_BANDS, SMOOTHING

								        # update particles based on fft transformed audio frequencies
								        analyser.onUpdate = ( bands ) => particle.energy = bands[ particle.band ] / 256 for particle in @particles
									        
									        # start as soon as the audio is buffered
									        analyser.start();
										      
										        # show audio controls
										        document.body.appendChild analyser.audio
											        
											        intro = document.getElementById 'intro'
												        intro.style.display = 'none'
													        
													        # bug in Safari 6 when using getByteFrequencyData with MediaElementAudioSource
													        # @see http://goo.gl/6WLx1
													        if /Safari/.test( navigator.userAgent ) and not /Chrome/.test( navigator.userAgent )
	        
	          warning = document.getElementById 'warning2'
		            warning.style.display = 'block'

			          catch error
				        
				      else
				            
				            # Web Audio API not detected
				            warning = document.getElementById 'warning1'
					          warning.style.display = 'block'
						      
						    draw: ->
						      
						        @globalCompositeOperation = 'lighter'
							  
							    for particle in @particles
							          
							          # recycle particles
							          if particle.y < -particle.size * particle.level * particle.scale * 2
								          
								          particle.reset();
									          particle.x = random @width
										          particle.y = @height + particle.size * particle.scale * particle.level
											        
											        particle.move()
	      particle.draw @
