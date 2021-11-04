from rest_framework import generics
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView


from .demo_api import *
from .serializars import *


# Not needed
# class HandleColumnData(generics.CreateAPIView):
#     queryset = ColumnData.objects.all()
#     serializer_class = ColumnDataSerializer
#     parser_classes = [FormParser, MultiPartParser]
#
#     def post(self, request, format=None):
#         if not self.request.session.exists(self.request.session.session_key):
#             self.request.session.create()
#         # return Response({'received data': request.data})
#
#         serialized = self.serializer_class(data=request.data)
#         if serialized.is_valid():
#             tmp_dict = {}
#             for attr in ['left','right','label']:
#                 tmp_dict[attr] = request.data.get(attr)
#             new_obj = ColumnData(**tmp_dict)
#             new_obj.save()
#             return Response(serialized.data, status=status.HTTP_201_CREATED)
#
#         return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class File(generics.CreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = [FormParser, MultiPartParser]

    def post(self, request, format=None, **kwargs):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        # return Response({'received data': request.data})

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            file = request.FILES.get('file')
            file_type = 'dataset'
            # queryset = Document.objects.filter(file=Document.file.field.upload_to + file.name)
            # if queryset.exists():

            q = Document.objects.filter(file='files/' + file.name)
            if q.exists():
                q.delete()
                tmp_path = os.path.join(BASE_DIR, 'files', file.name + '_explanation_dict.pickle')
                # if os.path.isfile(tmp_path):
                #     os.remove(tmp_path)

            doc = Document(file=file, type=file_type)
            doc.save()
            self.request.session[file_type] = file.name
            return Response(file.name, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

    # def post(self, request, format=None):
    #     if not self.request.session.exists(self.request.session.session_key):
    #         self.request.session.create()
    #     # return Response({'received data': request.data})
    #
    #     serializer = self.serializer_class(data=request.data)
    #     if serializer.is_valid():
    #         file = request.FILES.get('file')
    #         type = serializer.data.get('type')
    #         # queryset = Document.objects.filter(file=Document.file.field.upload_to + file.name)
    #         # if queryset.exists():
    #         Document.objects.filter(type=type).delete()
    #
    #         doc = Document(file=file, type=type)
    #         doc.save()
    #         self.request.session[type] = file.name
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #
    #     return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class Explain(generics.ListCreateAPIView):
    queryset = IdValue.objects.all()
    serializer_class = IdSerializer

    # parser_classes = [FormParser, MultiPartParser]

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serialized = self.serializer_class(data=request.data)
        if serialized.is_valid():
            index_list = serialized.data.get('index_list')
            # tmp_dict = {}
            # for curr_type in Document.CHOICES:
            #     queryset = Document.objects.filter(type=curr_type)
            #     if not queryset.exists():
            #         return Response({'Bad Request': 'ModelWrapper, model state and dataset must be all loaded.'}, status=status.HTTP_400_BAD_REQUEST)
            #     tmp_dict[curr_type] = queryset[0]
            # state_path = os.path.abspath(tmp_dict['model_state'].file.path)
            # dataset_path = os.path.abspath(tmp_dict['dataset'].file.path)

            state_path = os.path.join(BASE_DIR, 'files', serialized.data.get('model_state'))
            dataset_path = os.path.join(BASE_DIR, 'files', serialized.data.get('dataset_name'))
            ret_value = explain_elements(state_path=state_path, dataset_path=dataset_path, ids=index_list)
            return Response(ret_value, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class Adversarial(generics.ListCreateAPIView):
    queryset = IdValue.objects.all()
    serializer_class = IdSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = request.data
        if 'index_list' not in data.keys():
            data['index_list'] = []
        serialized = self.serializer_class(data=data)
        if serialized.is_valid():
            index_list = serialized.data.get('index_list')
            state_path = os.path.join(BASE_DIR, 'files', serialized.data.get('model_state'))
            dataset_path = os.path.join(BASE_DIR, 'files', serialized.data.get('dataset_name'))
            ret_value = get_adversarial(state_path=state_path, dataset_path=dataset_path, ids=index_list)
            return Response(ret_value, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)


class Elements(APIView):
    # queryset = IdValue.objects.all()
    serializer_class = IdListSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        data = request.data
        if 'index_list' not in data.keys():
            data['index_list'] = []
        serialized = self.serializer_class(data=data)
        if serialized.is_valid():
            index_list = serialized.data.get('index_list')
            tmp_path = os.path.join(BASE_DIR, 'files', request.data.get('dataset_name'))
            return Response(get_df_elements(tmp_path, index_list), status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)
