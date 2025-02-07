class apiError extends Error{

    constructor(statusCode,message="something went wrong",errors=[],data){

    super(message)
    this.statusCode=statusCode
    this.message=message
    this.success=false
    this.errors=errors
    this.data=data


    }

}

export {apiError}