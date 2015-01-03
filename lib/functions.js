function clamp(val) {
    return Math.min(1, Math.max(0, val));
}
module.exports = function(less) {
	function hsla(color) {
		var hsla = less.functions.functionRegistry.get("hsla");
		return hsla(color.h, color.s, color.l, color.a);
	}
	function number(n) {
		if (n.type === "Dimension") {
			return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
		} else if (typeof(n) === 'number') {
			return n;
		} else {
			throw {
				type: "Argument",
				message: "color functions take numbers as parameters"
			};
		}
	}
    return {
        /**
         * inverts the luma of a color giving a version darken or lighter than the original
         * @param {Color} color
         * @returns {Color}
         */
        invertluma: function( color ){
            var hsl = color.toHSL();
            hsl.l = 1 - hsl.l;
            hsl.l = clamp(hsl.l);
            return hsla(hsl);
        },
        
        /**
         * if color1 and color2 have a similar luma, it contrast color2 a little bit more. 
         * If the color2 luma resultant is greater than 1, or less than 0, its luma is pivoted around color1 luma.
         * @param {Color} color1
         * @param {Color} color2
         * @returns {Color}
         */
        contrastmore: function( color1, color2, minLumaDifference){
            var autocontrast = color2;
            var lumadif = Math.abs( color1.luma() - autocontrast.luma() );
            var hsl = autocontrast.toHSL();
            var missingLumaDif;
            var newluma; 
            
            if (typeof minLumaDifference === 'undefined') {
                minLumaDifference = 0.3;
            } else {
                minLumaDifference = number(minLumaDifference);
            }
            
            if( lumadif < minLumaDifference ){	
                missingLumaDif = minLumaDifference - lumadif;
                newluma = hsl.l;
                if( autocontrast.luma() > color1.luma() ){
                    newluma += missingLumaDif;
                } else {
                    newluma -= missingLumaDif;
                }
                newluma = clamp( newluma );
                hsl.l = newluma;
                autocontrast = hsla( hsl );
            }
            
            return autocontrast;
        },
                
                
        /**
         * if color1 and color2 have a similar luma, it contrast color2 a little bit more. 
         * If the color2 luma resultant is greater than 1, or less than 0, its luma gets inverted.
         * @param {Color} color1
         * @param {Color} color2
         * @returns {Color}
         */
        autocontrast: function( color1, color2, minLumaDifference){
            var autocontrast = color2;
            var lumadif = Math.abs( color1.luma() - autocontrast.luma() );
            var hsl = autocontrast.toHSL();
            var newLuma = hsl.l;
            var missingLuma;
            
            if (typeof minLumaDifference === 'undefined') {
                minLumaDifference = 0.3;
            } else {
                minLumaDifference = number(minLumaDifference);
            }
            
            if( lumadif < minLumaDifference){
                missingLuma = minLumaDifference - lumadif;
                newLuma += ( missingLuma * ( color1.luma() < newLuma ? 1 : -1  ) );
                if( newLuma > 1 || newLuma < 0 ){
                    newLuma = 1 - hsl.l;
                }
                newLuma = clamp( newLuma );
                hsl.l = newLuma;
                autocontrast = hsla( hsl );
            }
            
            return autocontrast;		
        }
    };
};
