/**
 * Manager for symfony collection form type
 * less DOM - faster app
 */
function MultiFormItems(params) {

    // Private variables - config
    
    /**
     * Area for multi items form
     */
    var _parent = params.parent || 'body';
    
    /**
     * Remove item btn selector
     */
    var _removeButton = params.removeButton;
    
    /**
     * Add item btn selector
     */
    var _addButton = params.addButton;
    
    /**
     * One nested item container selector
     */
    var _item = params.item;
    
    /**
     * Total items count in multi form
     */
    var _totalItems = 0;
    
    /**
     * Function to run after new item added to form
     */
    var _newItemCallback = params.newItemCallback;
    
    /**
     * Flag which shows if we need to add one item if form contains nothing
     */
    var _openIfZero = params.openIfZero || false;

    
    // Public API

    /**
     * Initialization of multi form manager
     */
    this.init = function() {
        this.recalculateSize();
        this.bind();
        if(_openIfZero) {
            this.openIfZero();
        }
    }

    this.openIfZero = function() {
        if(!_totalItems) {
            $(_addButton).trigger('click');
        }
    }

    this.recalculateSize = function() {
        _totalItems = $(_item).size();
    }

    this.initCss = function() {
        $(_parent + ' select').selectBox();
    }

    var _addMoreButton = function() {
        $(_parent + ' ' + _addButton + ':first').removeClass('extra_hidden');
    }

    var _removeMoreButton = function(btn) {
        $(btn).addClass('extra_hidden');
    }

    var _getPrepareInternalPrototype = function() {
        var prototype = $(_parent).data('prototype');

        return prototype.replace(/\$\$name\$\$/g, _totalItems).replace('$$order$$', _totalItems + 1);
    }

    var _addGlobalPrototype = function() {
        // zero items now, adding empty item
        var prototype = _getPrepareInternalPrototype();
        $(prototype).appendTo(_parent);

        // incr total items size
        _totalItems++;
    }

    this.bind = function() {
        // bind remove button binding
        $(_removeButton).live('click', function(event){
            event.preventDefault();
            var block = $(this).parents(_item);
            block.slideUp('slow').delay(1000, function(){
                block.remove();
                _totalItems--;
                if(!_totalItems) {
                    _addMoreButton();
                }
            });
        });

        // add more button binding
        // multi form buttons
        $(_addButton).live('click', function(event){
            event.preventDefault();
            _addGlobalPrototype();
            if(typeof _newItemCallback == 'function') {
                _newItemCallback();
            }
            _removeMoreButton(this);
        });
    }
        
}
