interface Option {
    /**
     * A dictionary mapping resource markers to a path to the resource.
     */
    [resource_marker:string]:string
    /**
     * A user-supplied string to be used as a resource marker prefix
     * instead of "RESOURCE_". If it is not provided, a default value
     * "RESOURCE_" will be used.
     */
    __prefix?:string
}

declare class InlineResource {
    constructor(option?:Option);
    /**
     * Performs the main operation of inlining. This method is bound
     * to `this` at a construction time, so there is no need to bind
     * again.
     */
    inline(file:string):string
}

export = InlineResource;
