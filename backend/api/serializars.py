from rest_framework import serializers

from .models import *


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('id', 'file')


class IdSerializer(serializers.ModelSerializer):
    index_list = serializers.ListField(child=serializers.IntegerField())

    class Meta:
        model = IdValue
        fields = ('id', 'index_list', 'model_state', 'dataset_name',
                      "left", 'right', 'label')

    # def to_representation(self, instance: IdValue):
    #     # instance.index_list = [int(i) for i in instance['index_list'].split(',')]
    #     return super(IdSerializer, self).to_representation(instance)

    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        if ret['index_list']:
            ret['value'] = ','.join(str(i) for i in ret['index_list'])
        return ret


class IdListSerializer(serializers.Serializer):
    index_list = serializers.ListField(child=serializers.IntegerField())
    dataset_name = serializers.CharField()

    class Meta:
        model = IdValue
        fields = ('index_list', 'dataset_name')


    def to_representation(self, instance: IdValue):
        # instance.value_list = [int(i) for i in instance['value_list'].split(',')]
        return super().to_representation(instance)

    def to_internal_value(self, data):
        ret = super().to_internal_value(data)
        if ret['index_list']:
            ret['value'] = ','.join(str(i) for i in ret['index_list'])
        return ret


class ColumnDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ColumnData
        fields = '__all__'