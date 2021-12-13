(function($){
    //Variables
    var $navLinksClick = $('.nav-click');
    var $menuMobileClick = $('#menu-click');
    var $cancelMobileClick = $('#cancel-modal');
    var $navMobileVar = $('.nav-mobile');
    var $menuLi = $('.nav-mobile ul li.nav-click');
    var $menuContentReference=$('.nav-mobile .content-holder');
    // Functions

    //01. For popping the modals under the menu in the desktop view of the application
    function linkClicked(e){
        var $this = $(this),
            $selectors = $('.nav-click .content-sub');
            //Check if the current one has the is-open Class
            if($this.children('.content-sub').hasClass('is-open')){
                $this.children('.content-sub').removeClass('is-open')
            }else{
                //else remove the is open from any other one
                //and add it the currently clicked one
                $selectors.removeClass('is-open');
                $this.children('.content-sub').toggleClass('is-open');
            }
    }
    //02. opening the mobile navbar for the user
    function mobileClickFunction(e){
        var $this = $(this);
        $navMobileVar.addClass('toggled');
        
    }

    //03. Closing the Mobile Navbar for the user
    function mobileCloseFunction(e){
        var $this= $(this);
        $navMobileVar.removeClass('toggled');
    }

     // 04. Any inner Menu Selected should further trigger is children
     function innerMenuChildOpen(){
         var $this = $(this),
            $pos =  $navMobileVar.children().filter('ul').children().filter('li.nav-click').index( $this );

            $menuContentReference.children().eq($pos).addClass('is-me');
     }

     // 05. Closing the Menu Selected Modal- i.e the Nav Content 
     function closeInnerChild(e){
         var $this = $(this);
            $this.parent().removeClass('is-me');

     }


    $(document).ready(function(){

        //01.Nav Links Click
        $navLinksClick.on('click', linkClicked);

        //02.Mobile Nav Clicks
            //opening navbar
        $menuMobileClick.on('click', mobileClickFunction);
            //closing navbar
        $cancelMobileClick.on('click', mobileCloseFunction);
            //Attaching Events to the NavMenu to trigger corresponding Nav Content Modal
        $menuLi.on('click', innerMenuChildOpen);
            //Attaching Event to the Main Menu Button
        $menuContentReference.children().find('.back-btn').on('click', closeInnerChild);

    });

})(jQuery);