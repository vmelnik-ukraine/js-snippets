/**
 * Spectator which scans forms in selected area
 * Requires: jQuery
 * Examples of usage will be provided asap
 * 
 * @param {String} selector Area to observe all inner forms changes or form selector
 */
function FormSpectator(selector) {
    
    // Private properties
    var _area = selector || 'body';
    var _registry = [];
    
    // Public API
    
    /**
     * Checks if changes were applied to forms
     * 
     * @return {Boolean} Result of checks
     */
    this.wasChanges = function() {
        for(var id in _registry) {
            if(_isStateChanged(id)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Reinit registry after ajax
     */
    this.reinit = function() {
        _registry = [];
        _initRegistry();
    }
    
    // Private methods
    
    /**
     * Initialization of registry. First snapshot of forms state
     */
    function _initRegistry() {
        var forms = _grepForms();
        forms.each(function(){
            var id = $(this).attr('id');
            if(!id) {
                id = _generateIdForForm(this);
                $(this).attr('id', id);
            }
            _registry[id] = _makeSnapshot(this);
        });
    }
    
    /**
     * Greps all forms in selected area
     * 
     * @return {Object} All found forms
     */
    function _grepForms() {
        return _isAreaSingleForm() ? $(_area) : $(_area).find('form');
    }
    
    /**
     * Checks if provided area is single form
     */
    function _isAreaSingleForm() {
        return $(_area).prop('tagName') == 'FORM';
    }
    
    /**
     * Greps form from DOM observer area by id
     * 
     * @param {Int} id Form identifier
     * @return {Object|Null} Returns jQuery object represented by form or null
     */
    function _findFormById(id) {
        if(_isAreaSingleForm()) {
            return $(_area).attr('id') == id ? $(_area) : null;
        } else {
            return $(_area).find('form#' + id);
        }
    }
    
    /**
     * Generates form identifier
     * 
     * @param {Object} formObj Form object
     * @return {Int} Returns new identifier for form
     */
    function _generateIdForForm(formObj) {
        var name = $(formObj).attr('name') | '';
        var action = $(formObj).attr('action') | '';
        var method = $(formObj).attr('method') | '';

        return name & action & method;
    }
    
    /**
     * Makes snapshot of form
     * 
     * @param {Object} formObj Form jQuery object from DOM
     * @return {Object} Snapshot object
     */
    function _makeSnapshot(formObj) {
        return $.param($(formObj).formToArray());
    }
    
    /**
     * Checks if form state was changed
     * 
     * @param {Int} id Identifier of form
     * @return {Boolean} Result of compare operation
     */
    function _isStateChanged(id) {
        var registryForm = _registry[id];
        var currentForm = _makeSnapshot(_findFormById(id));
        
        return registryForm != currentForm;
    }
    
    // Initialization with provided params
    _initRegistry();
    
}