import { ApplicationRef, ComponentFactoryResolver, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { ComponentLoader } from './component-loader.class';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { DOCUMENT } from '@angular/common';
import * as i0 from "@angular/core";
import * as i1 from "ngx-bootstrap/positioning";
export class ComponentLoaderFactory {
    constructor(_componentFactoryResolver, _ngZone, _injector, _posService, _applicationRef, _document) {
        this._componentFactoryResolver = _componentFactoryResolver;
        this._ngZone = _ngZone;
        this._injector = _injector;
        this._posService = _posService;
        this._applicationRef = _applicationRef;
        this._document = _document;
    }
    /**
     *
     * @param _elementRef
     * @param _viewContainerRef
     * @param _renderer
     */
    createLoader(_elementRef, _viewContainerRef, _renderer) {
        return new ComponentLoader(_viewContainerRef, _renderer, _elementRef, this._injector, this._componentFactoryResolver, this._ngZone, this._applicationRef, this._posService, this._document);
    }
}
ComponentLoaderFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: ComponentLoaderFactory, deps: [{ token: i0.ComponentFactoryResolver }, { token: i0.NgZone }, { token: i0.Injector }, { token: i1.PositioningService }, { token: i0.ApplicationRef }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
ComponentLoaderFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: ComponentLoaderFactory, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.6", ngImport: i0, type: ComponentLoaderFactory, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i0.ComponentFactoryResolver }, { type: i0.NgZone }, { type: i0.Injector }, { type: i1.PositioningService }, { type: i0.ApplicationRef }, { type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LWxvYWRlci5mYWN0b3J5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBvbmVudC1sb2FkZXIvY29tcG9uZW50LWxvYWRlci5mYWN0b3J5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxjQUFjLEVBQUUsd0JBQXdCLEVBQWMsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQ2xGLE1BQU0sRUFDUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFDM0QsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDL0QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDOzs7QUFHM0MsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUFvQix5QkFBbUQsRUFDbkQsT0FBZSxFQUNmLFNBQW1CLEVBQ25CLFdBQStCLEVBQy9CLGVBQStCLEVBQ2IsU0FBbUI7UUFMckMsOEJBQXlCLEdBQXpCLHlCQUF5QixDQUEwQjtRQUNuRCxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsY0FBUyxHQUFULFNBQVMsQ0FBVTtRQUNuQixnQkFBVyxHQUFYLFdBQVcsQ0FBb0I7UUFDL0Isb0JBQWUsR0FBZixlQUFlLENBQWdCO1FBQ2IsY0FBUyxHQUFULFNBQVMsQ0FBVTtJQUN0RCxDQUFDO0lBRUo7Ozs7O09BS0c7SUFDSCxZQUFZLENBQUksV0FBd0IsRUFDeEIsaUJBQW9DLEVBQ3BDLFNBQXFCO1FBRW5DLE9BQU8sSUFBSSxlQUFlLENBQ3hCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsV0FBVyxFQUNYLElBQUksQ0FBQyxTQUFTLEVBQ2QsSUFBSSxDQUFDLHlCQUF5QixFQUM5QixJQUFJLENBQUMsT0FBTyxFQUNaLElBQUksQ0FBQyxlQUFlLEVBQ3BCLElBQUksQ0FBQyxXQUFXLEVBQ2hCLElBQUksQ0FBQyxTQUFTLENBQ2YsQ0FBQztJQUNKLENBQUM7O21IQTlCVSxzQkFBc0Isd0tBTWIsUUFBUTt1SEFOakIsc0JBQXNCLGNBRFYsTUFBTTsyRkFDbEIsc0JBQXNCO2tCQURsQyxVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzsyTUFPbUIsUUFBUTswQkFBNUMsTUFBTTsyQkFBQyxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlciwgRWxlbWVudFJlZiwgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3RvcixcbiAgTmdab25lLCBSZW5kZXJlcjIsIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21wb25lbnRMb2FkZXIgfSBmcm9tICcuL2NvbXBvbmVudC1sb2FkZXIuY2xhc3MnO1xuaW1wb3J0IHsgUG9zaXRpb25pbmdTZXJ2aWNlIH0gZnJvbSAnbmd4LWJvb3RzdHJhcC9wb3NpdGlvbmluZyc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIENvbXBvbmVudExvYWRlckZhY3Rvcnkge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfbmdab25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgIHByaXZhdGUgX2luamVjdG9yOiBJbmplY3RvcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfcG9zU2VydmljZTogUG9zaXRpb25pbmdTZXJ2aWNlLFxuICAgICAgICAgICAgICBwcml2YXRlIF9hcHBsaWNhdGlvblJlZjogQXBwbGljYXRpb25SZWYsXG4gICAgICAgICAgICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgX2RvY3VtZW50OiBEb2N1bWVudFxuICApIHt9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSBfZWxlbWVudFJlZlxuICAgKiBAcGFyYW0gX3ZpZXdDb250YWluZXJSZWZcbiAgICogQHBhcmFtIF9yZW5kZXJlclxuICAgKi9cbiAgY3JlYXRlTG9hZGVyPFQ+KF9lbGVtZW50UmVmPzogRWxlbWVudFJlZixcbiAgICAgICAgICAgICAgICAgIF92aWV3Q29udGFpbmVyUmVmPzogVmlld0NvbnRhaW5lclJlZixcbiAgICAgICAgICAgICAgICAgIF9yZW5kZXJlcj86IFJlbmRlcmVyMixcbiAgKTogQ29tcG9uZW50TG9hZGVyPFQ+IHtcbiAgICByZXR1cm4gbmV3IENvbXBvbmVudExvYWRlcjxUPihcbiAgICAgIF92aWV3Q29udGFpbmVyUmVmLFxuICAgICAgX3JlbmRlcmVyLFxuICAgICAgX2VsZW1lbnRSZWYsXG4gICAgICB0aGlzLl9pbmplY3RvcixcbiAgICAgIHRoaXMuX2NvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICAgIHRoaXMuX25nWm9uZSxcbiAgICAgIHRoaXMuX2FwcGxpY2F0aW9uUmVmLFxuICAgICAgdGhpcy5fcG9zU2VydmljZSxcbiAgICAgIHRoaXMuX2RvY3VtZW50XG4gICAgKTtcbiAgfVxufVxuIl19