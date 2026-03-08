from rest_framework.permissions import SAFE_METHODS, BasePermission


class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == request.user.Roles.ADMIN
        )


class IsAdminOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == request.user.Roles.ADMIN
        )


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == request.user.Roles.ADMIN:
            return True

        owner = getattr(obj, "user", None)
        if owner is not None:
            return owner == request.user

        return False

