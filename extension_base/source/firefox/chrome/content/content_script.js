(function() {
    function walk(node)
    {
        var child, next;
        
        switch ( node.nodeType )
        {
            case 1:  // Element
            case 9:  // Document
            case 11: // Document fragment
                child = node.firstChild;
                while ( child )
                {
                    next = child.nextSibling;
                    walk(child);
                    child = next;
                }
                break;
            
            case 3: // Text node
                handleText(node);
                break;
        }
    }
    
    function handleText(textNode)
    {
        var v = textNode.nodeValue;
        
        CONTENT
        
        textNode.nodeValue = v;
    }
    
    function windowLoadHandler()
    {
        // Dear Mozilla: I hate you for making me do this.
        window.removeEventListener('load', windowLoadHandler);
        
        document.getElementById('appcontent').addEventListener('DOMContentLoaded', function(e) {
            walk(e.originalTarget.body);
            
            new MutationObserver(function() {
              walk(e.originalTarget.body);
            }).observe(e.originalTarget.body, {
              childList: true
            });
        });
    }
    
    window.addEventListener('load', windowLoadHandler);
}());
