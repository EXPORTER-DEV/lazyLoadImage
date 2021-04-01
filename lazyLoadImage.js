(function(w, s){
	if(typeof module == "object" && typeof module.exports == "object"){
		if(module.exports !== w.document){
			if(!w.document) throw new Error('Can\'t init lazyLoadImage, required: window, document.');
		}
	}
	if(typeof w !== "undefined" && typeof w.document !== "undefined"){
		return s(w);
	}else{
		throw new Error('Can\'t init lazyLoadImage.');
	}
})((typeof window !== "undefined" ? window : this), function(w){
	w.lazyLoadImage = {
		debug: 0,
        tracking: [],
        startTracking: function(item){
            item._lazyLoadID = Math.random();
            if(this.debug) console.log('added resource: '+item.getAttribute('data-src')+' (_lazyLoadID): '+item._lazyLoadID);
            this.tracking.push(item);
        },
        stopTracking: function(item){
            const lazyLoadImage = this;
            this.tracking.forEach(function(tracking, index){
                if(tracking._lazyLoadID == item._lazyLoadID){
                    if(lazyLoadImage.debug) console.log('removed resource (_lazyLoadID): '+item._lazyLoadID);
                    lazyLoadImage.tracking.splice(index, 1);
                }
            });
        },
        observeDOM: (function(){
            const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
              return function( obj, callback ){
                if(!obj || obj.nodeType !== 1) return; 
                if(MutationObserver){
                  const mutationObserver = new MutationObserver(callback)
                  mutationObserver.observe( obj, { childList:true, subtree:true, attributes: true })
                  return mutationObserver
                }else if(window.addEventListener){
                  obj.addEventListener('DOMNodeInserted', callback, false)
                  obj.addEventListener('DOMNodeRemoved', callback, false)
                }
              }
        })(),
        isInViewport: function(item){
        	let offset = 0;

            if(item.getAttribute('data-offset')){
				try {
                	offset = parseInt(item.getAttribute('data-offset'));
            	}catch(e){}
            }

        	if(item.getAttribute('data-viewport')){
            	const data_viewport = item.getAttribute('data-viewport');
            	if(data_viewport){
            		switch(data_viewport.toString().toLowerCase()){
            			case "parent":
            			item = item.parentElement;
            		}
            	}
            }

            let top = item.offsetTop;
            let height = item.offsetHeight;

            if(offset !== 0){
                top += offset;
                height -= (offset * 2);
            }
    
            while(item.offsetParent){
              item = item.offsetParent;
              top += item.offsetTop;
            }
    
            return (
              (top < (window.pageYOffset + window.innerHeight) && //
              (top + height) > window.pageYOffset) // if full element in viewport
              || 
              (top + height > window.pageYOffset && //
              top < window.pageYOffset) // if element bottom part in viewport, top part is out of.
              || 
              (top > window.pageYOffset && //
              top < (window.pageYOffset + window.innerHeight)) // if element top part in viewport, bottom part is out of.
            );
        },
        contentChange: function(){
            const lazyLoadImage = this;
            w.document.querySelectorAll('[data-src').forEach(function(item){
                if(item.getAttribute('data-src')){
                    if(!lazyLoadImage.tracking.find((tracking) => {return item._lazyLoadID == tracking._lazyLoadID;})){
                        lazyLoadImage.startTracking(item);
                    }
                }
            });
            this.viewportChange();
        },
        viewportChange: function(){
            const lazyLoadImage = this;
            const items = lazyLoadImage.tracking.concat([]);
            items.forEach(function(item, index){
                if(item.getAttribute('data-src')){
                    if(lazyLoadImage.debug) console.log('resource: '+item.getAttribute('data-src')+', viewport: '+(item.getAttribute('data-viewport') === null ? 0 : 1));
                    if(item.getAttribute('data-viewport') === null || lazyLoadImage.isInViewport(item)){
                        if(item.getAttribute('data-css') !== null){
                            item.style.backgroundImage = 'url('+item.getAttribute('data-src')+')';
                        }else{
                            item.setAttribute('src', item.getAttribute('data-src'));
                        }
                        if(lazyLoadImage.debug) console.log('started loading resource: '+item.getAttribute('data-src'));
                        item.setAttribute('data-src', '');
                        lazyLoadImage.stopTracking(item);
                    }
                }else if(lazyLoadImage.debug) console.error('undefined resource: '+item.outerHTML);
                
            });
            //window.MutationObserver || window.WebKitMutationObserve
        },
        init: function(){
            this.contentChange();
            this.observeDOM(w.document.body, this.contentChange.bind(this));
            w.addEventListener('scroll', this.viewportChange.bind(this));
        },
        start: function(opt = {}){
        	if(this.inited) return;
        	const { debug: d } = opt;

        	this.debug = d;
        	this.inited = 1;
            
            w.document.addEventListener('DOMContentLoaded', this.init.bind(this));
        },
	};
	return w.lazyLoadImage;
});